export interface Ghost {
  id: string;
  name: string;
  trait: string;
  imagePath: string;

  onError(count: number): string;
  onWarning(count: number): string;
  onSave(errorCount: number, warningCount: number): string;
  onFileOpen(fileType: string, lineCount: number): string;
  onCodeChange(): string;
  getClickMessages(): string[];
}
