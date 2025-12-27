import * as vscode from "vscode";

export function countDiagnostics(diagnostics: [vscode.Uri, vscode.Diagnostic[]][]): { errors: number; warnings: number } {
  let errors = 0;
  let warnings = 0;

  for (const [, diags] of diagnostics) {
    errors += diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
    warnings += diags.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
  }

  return { errors, warnings };
}

export function countDocumentDiagnostics(diagnostics: vscode.Diagnostic[]): { errors: number; warnings: number } {
  const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
  const warnings = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;

  return { errors, warnings };
}
