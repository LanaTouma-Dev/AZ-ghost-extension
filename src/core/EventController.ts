import * as vscode from "vscode";
import { Ghost } from "../ghosts";
import { GhostViewProvider } from "./GhostViewProvider";
import { countDiagnostics, countDocumentDiagnostics } from "../utils/diagnostics";

const IDLE_TIMEOUT_MS         = 3 * 60 * 1000;
const CODE_CHANGE_DEBOUNCE_MS = 2000;
const SESSION_MILESTONES      = [1, 2];
const COFFEE_NUDGE_MS         = 45 * 60 * 1000;
const FOCUS_GAP_MS            = 5 * 60 * 1000;

interface GitRepository {
  state: {
    HEAD: { name?: string; commit?: string } | undefined;
    onDidChange: vscode.Event<void>;
  };
}

interface GitAPI {
  repositories: GitRepository[];
  onDidOpenRepository: vscode.Event<GitRepository>;
}

export class EventController {
  private codeChangeTimer: ReturnType<typeof setTimeout> | undefined;
  private idleTimer:       ReturnType<typeof setTimeout> | undefined;
  private focusStartMs   = 0;
  private lastActivityMs = 0;

  constructor(
    private readonly ghost: Ghost,
    private readonly ghostProvider: GhostViewProvider
  ) {}

  public registerEvents(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.languages.onDidChangeDiagnostics(() => this.handleDiagnosticsChange()),
      vscode.window.onDidChangeActiveTextEditor(editor => this.handleFileOpen(editor)),
      vscode.workspace.onDidSaveTextDocument(document => this.handleFileSave(document)),
      vscode.workspace.onDidChangeTextDocument(event => this.handleTextChange(event)),
      { dispose: () => { clearTimeout(this.codeChangeTimer); clearTimeout(this.idleTimer); } }
    );

    this.startSessionTimers(context);
    this.setupGitWatcher(context);
  }

  private send(message: string, priority: 'high' | 'normal' = 'normal') {
    this.ghostProvider.sendMessageToGhost(message, this.ghost.getMood(), priority);
  }

  private startSessionTimers(context: vscode.ExtensionContext) {
    for (const hours of SESSION_MILESTONES) {
      const timer = setTimeout(() => {
        this.send(this.ghost.onSessionMilestone(hours), 'high');
      }, hours * 60 * 60 * 1000);
      context.subscriptions.push({ dispose: () => clearTimeout(timer) });
    }
  }

  private handleDiagnosticsChange() {
    const diagnostics = vscode.languages.getDiagnostics();
    const { errors, warnings } = countDiagnostics(diagnostics);

    if (errors > 0) {
      this.send(this.ghost.onError(errors));
    } else if (warnings > 0) {
      this.send(this.ghost.onWarning(warnings));
    }
  }

  private handleFileOpen(editor: vscode.TextEditor | undefined) {
    if (!editor?.document) return;
    const fileType = editor.document.fileName.split(".").pop() ?? "";
    const lineCount = editor.document.lineCount;
    this.send(this.ghost.onFileOpen(fileType, lineCount), 'high');
  }

  private handleFileSave(document: vscode.TextDocument) {
    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    const { errors, warnings } = countDocumentDiagnostics(diagnostics);
    this.send(this.ghost.onSave(errors, warnings), 'high');
  }

  private async setupGitWatcher(context: vscode.ExtensionContext) {
    const gitExtension = vscode.extensions.getExtension<{ getAPI(version: number): GitAPI }>('vscode.git');
    if (!gitExtension) { return; }

    const git = (await gitExtension.activate()).getAPI(1);
    for (const repo of git.repositories) { this.watchRepository(repo, context); }
    context.subscriptions.push(
      git.onDidOpenRepository(repo => this.watchRepository(repo, context))
    );
  }

  private watchRepository(repo: GitRepository, context: vscode.ExtensionContext) {
    let lastBranch = repo.state.HEAD?.name;
    let lastCommit = repo.state.HEAD?.commit;

    context.subscriptions.push(
      repo.state.onDidChange(() => {
        const branch = repo.state.HEAD?.name;
        const commit = repo.state.HEAD?.commit;

        if (branch && lastBranch && branch !== lastBranch) {
          this.send(this.ghost.onBranchSwitch(branch), 'high');
        } else if (commit && lastCommit && commit !== lastCommit) {
          this.send(this.ghost.onCommit(), 'high');
        }

        lastBranch = branch;
        lastCommit = commit;
      })
    );
  }

  private trackFocus() {
    const now = Date.now();
    if (now - this.lastActivityMs > FOCUS_GAP_MS) {
      this.focusStartMs = now;
    }
    this.lastActivityMs = now;

    if (now - this.focusStartMs >= COFFEE_NUDGE_MS) {
      this.focusStartMs = now;
      this.send(this.ghost.onCoffeeNudge(), 'high');
    }
  }

  private handleTextChange(event: vscode.TextDocumentChangeEvent) {
    if (event.contentChanges.length === 0) return;

    this.trackFocus();

    clearTimeout(this.codeChangeTimer);
    this.codeChangeTimer = setTimeout(() => {
      this.send(this.ghost.onCodeChange());
    }, CODE_CHANGE_DEBOUNCE_MS);

    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.send(this.ghost.onIdle(), 'high');
    }, IDLE_TIMEOUT_MS);
  }
}
