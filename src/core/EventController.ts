import * as vscode from "vscode";
import { Ghost } from "../ghosts";
import { GhostViewProvider } from "./GhostViewProvider";
import { countDiagnostics, countDocumentDiagnostics } from "../utils/diagnostics";

export class EventController {
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

  private handleDiagnosticsChange() {
    const diagnostics = vscode.languages.getDiagnostics();
    const { errors, warnings } = countDiagnostics(diagnostics);

    if (errors > 0) {
      this.ghostProvider.sendMessageToGhost(this.ghost.onError(errors));
    } else if (warnings > 0) {
      this.ghostProvider.sendMessageToGhost(this.ghost.onWarning(warnings));
    }
  }

  private handleFileOpen(editor: vscode.TextEditor | undefined) {
    if (!editor?.document) return;

    const fileName = editor.document.fileName;
    const lineCount = editor.document.lineCount;
    const fileType = fileName.split(".").pop() || "";

    this.ghostProvider.sendMessageToGhost(this.ghost.onFileOpen(fileType, lineCount));
  }

  private handleFileSave(document: vscode.TextDocument) {
    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    const { errors, warnings } = countDocumentDiagnostics(diagnostics);

    this.ghostProvider.sendMessageToGhost(this.ghost.onSave(errors, warnings));
  }

  private handleTextChange(event: vscode.TextDocumentChangeEvent) {
    if (event.contentChanges.length > 0) {
      this.ghostProvider.sendMessageToGhost(this.ghost.onCodeChange());
    }
  }
}
