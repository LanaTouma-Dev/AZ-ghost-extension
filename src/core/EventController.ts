import * as vscode from "vscode";
import { Ghost } from "../ghosts";
import { GhostViewProvider } from "./GhostViewProvider";
import { countDiagnostics, countDocumentDiagnostics } from "../utils/diagnostics";

const IDLE_TIMEOUT_MS    = 3 * 60 * 1000;
const SESSION_MILESTONES = [1, 2];

export class EventController {
  private codeChangeTimer: ReturnType<typeof setTimeout> | undefined;
  private idleTimer:       ReturnType<typeof setTimeout> | undefined;

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

  private handleTextChange(event: vscode.TextDocumentChangeEvent) {
    if (event.contentChanges.length === 0) return;

    clearTimeout(this.codeChangeTimer);
    this.codeChangeTimer = setTimeout(() => {
      this.send(this.ghost.onCodeChange());
    }, 2000);

    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.send(this.ghost.onIdle(), 'high');
    }, IDLE_TIMEOUT_MS);
  }
}
