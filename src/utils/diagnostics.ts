import * as vscode from "vscode";

export function countDocumentDiagnostics(diagnostics: vscode.Diagnostic[]): { errors: number; warnings: number } {
  const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
  const warnings = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
  return { errors, warnings };
}

export function countDiagnostics(diagnostics: [vscode.Uri, vscode.Diagnostic[]][]): { errors: number; warnings: number } {
  return countDocumentDiagnostics(diagnostics.flatMap(([, diags]) => diags));
}
