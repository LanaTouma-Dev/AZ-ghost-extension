import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const provider = new GhostViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      GhostViewProvider.viewType,
      provider
    )
  );
}

class GhostViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "azGhosts.sidebar";
  private _extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this._extensionUri = extensionUri;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this._getHtmlForWebview();
  }

  private _getHtmlForWebview() {
    return /* html */ `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <style>
          body {
            background: #1e1e1e;
            margin: 0;
            padding: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
          .ghost {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50% 50% 40% 40%;
            position: relative;
            animation: float 3s ease-in-out infinite;
          }
          .ghost::before {
            content: '';
            position: absolute;
            bottom: -12px;
            left: 0;
            width: 100%;
            height: 12px;
            background: repeating-linear-gradient(
              to right,
              white 0,
              white 12px,
              transparent 12px,
              transparent 24px
            );
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        </style>
      </head>
      <body>
        <div class="ghost"></div>
      </body>
      </html>
    `;
  }
}
