import * as vscode from "vscode";
import { getGhost } from "./ghosts";
import { GhostViewProvider } from "./core/GhostViewProvider";
import { EventController } from "./core/EventController";

export function activate(context: vscode.ExtensionContext) {
  const ghost = getGhost("az1");
  const ghostProvider = new GhostViewProvider(context.extensionUri, ghost);
  const eventController = new EventController(ghost, ghostProvider);

  const viewProviderRegistration = vscode.window.registerWebviewViewProvider(
    GhostViewProvider.viewType,
    ghostProvider,
    { webviewOptions: { retainContextWhenHidden: true } }
  );
  context.subscriptions.push(viewProviderRegistration);

  eventController.registerEvents(context);

  context.subscriptions.push(
    vscode.commands.registerCommand('azGhosts.toggleMute', () => ghostProvider.toggleMute())
  );

  vscode.window.showInformationMessage('AZ Ghosts extension activated! Look for the ghost icon in the left sidebar.');
}

export function deactivate() {}
