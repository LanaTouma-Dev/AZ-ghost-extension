import * as vscode from "vscode";
import { Ghost } from "../ghosts";

export class GhostViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "azGhosts.sidebar";
  private _view?: vscode.WebviewView;
  private _muted = false;

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

    webviewView.webview.onDidReceiveMessage(message => {
      if (message.type === 'coffee') {
        this.sendMessageToGhost(this._ghost.onCoffee(), this._ghost.getMood(), 'high');
      }
    });
  }

  public toggleMute() {
    this._muted = !this._muted;
    this._view?.webview.postMessage({ type: 'muteChange', muted: this._muted });
    vscode.window.showInformationMessage(this._muted ? 'AZ Ghost muted.' : 'AZ Ghost unmuted.');
  }

  public sendMessageToGhost(text: string, mood: string = 'happy', priority: 'high' | 'normal' = 'normal') {
    if (!this._view || this._muted) return;
    this._view.webview.postMessage({ type: "ghostMessage", text, mood, priority });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "ghost.js")
    );
    const imageUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", this._ghost.imagePath)
    );
    const clickMessages = JSON.stringify(this._ghost.getClickMessages());

    const moodSprites: Record<string, string> = { default: imageUri.toString() };
    for (const [mood, file] of Object.entries(this._ghost.moodImagePaths ?? {})) {
      if (!file) { continue; }
      moodSprites[mood] = webview
        .asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", file))
        .toString();
    }
    const moodSpritesJson = JSON.stringify(moodSprites);

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

    .coffee-btn {
      margin-top: 8px;
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      opacity: 0.45;
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    }
    .coffee-btn:hover { opacity: 1; transform: scale(1.2); }
  </style>
</head>
<body>
  <div class="ghost-container">
    <div class="ghost" id="az1-ghost">
      <img src="${imageUri}" alt="${this._ghost.name}">
    </div>
<div class="speech-bubble" id="az1-speech-bubble"></div>
    <button class="coffee-btn" id="coffee-btn" title="Give AZ a coffee">&#9749;</button>
  </div>
  <script>const CLICK_MESSAGES = ${clickMessages}; const MOOD_SPRITES = ${moodSpritesJson};</script>
  <script src="${scriptUri}"></script>
</body>
</html>`;
  }
}
