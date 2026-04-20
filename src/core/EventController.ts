import * as vscode from "vscode";
import { Ghost } from "../ghosts";
import { GhostViewProvider } from "./GhostViewProvider";
import { countDiagnostics, countDocumentDiagnostics } from "../utils/diagnostics";

export class EventController {
  private codeChangeTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly ghost: Ghost,
    private readonly ghostProvider: GhostViewProvider
  ) {}

  public registerEvents(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.languages.onDidChangeDiagnostics(() => this.handleDiagnosticsChange()),
      vscode.window.onDidChangeActiveTextEditor(editor => this.handleFileOpen(editor)),
      vscode.workspace.onDidSaveTextDocument(document => this.handleFileSave(document)),
      vscode.workspace.onDidChangeTextDocument(event => this.handleTextChange(event))
    );
  }

  private send(message: string) {
    this.ghostProvider.sendMessageToGhost(message, this.ghost.getMood());
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
    this.send(this.ghost.onFileOpen(fileType, lineCount));
  }

  private handleFileSave(document: vscode.TextDocument) {
    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    const { errors, warnings } = countDocumentDiagnostics(diagnostics);
    this.send(this.ghost.onSave(errors, warnings));
  }

  private handleTextChange(event: vscode.TextDocumentChangeEvent) {
    if (event.contentChanges.length === 0) return;
    clearTimeout(this.codeChangeTimer);
    this.codeChangeTimer = setTimeout(() => {
      this.send(this.ghost.onCodeChange());
    }, 2000);
  }
}
