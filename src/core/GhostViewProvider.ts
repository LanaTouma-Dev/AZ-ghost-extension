import * as vscode from "vscode";
import { Ghost } from "../ghosts";

export class GhostViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "azGhosts.sidebar";
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _ghost: Ghost
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    webviewView.title = "AZ Ghost";
  }

  public sendMessageToGhost(text: string, mood: string = 'happy', priority: 'high' | 'normal' = 'normal') {
    if (!this._view) return;
    this._view.webview.postMessage({ type: "ghostMessage", text, mood, priority });
    vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "ghost.js")
    );
    const imageUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", this._ghost.imagePath)
    );
    const clickMessages = JSON.stringify(this._ghost.getClickMessages());

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src 'unsafe-inline' ${webview.cspSource};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this._ghost.name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    body, html {
      height: 100vh;
      width: 100vw;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--vscode-editor-background);
    }

    .ghost-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .ghost {
      width: 64px;
      height: 64px;
      animation: float 3s ease-in-out infinite;
      cursor: pointer;
    }

    .ghost img {
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }

    .speech-bubble {
      position: absolute;
      bottom: 80px;
      background: var(--vscode-editor-background);
      color: var(--vscode-foreground);
      border: 1px solid var(--vscode-textLink-foreground);
      border-radius: 10px;
      padding: 8px 12px;
      max-width: 160px;
      font-size: 12px;
      line-height: 1.4;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease-in-out, border-color 0.3s ease-in-out;
    }

    .speech-bubble.show { opacity: 1; }

    .speech-bubble.mood-happy   { border-color: var(--vscode-textLink-foreground); }
    .speech-bubble.mood-excited { border-color: #98c379; }
    .speech-bubble.mood-grumpy  { border-color: #e06c75; }
    .speech-bubble.mood-tired   { border-color: #5c6370; }
  </style>
</head>
<body>
  <div class="ghost-container">
    <div class="ghost" id="az1-ghost">
      <img src="${imageUri}" alt="${this._ghost.name}">
    </div>
    <div class="speech-bubble" id="az1-speech-bubble"></div>
  </div>
  <script>const CLICK_MESSAGES = ${clickMessages};</script>
  <script src="${scriptUri}"></script>
</body>
</html>`;
  }
}
