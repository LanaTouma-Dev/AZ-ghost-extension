export interface Ghost {
  id: string;
  name: string;
  trait: string;
  imagePath: string;

  getMood(): string;
  onError(count: number): string;
  onWarning(count: number): string;
  onSave(errorCount: number, warningCount: number): string;
  onFileOpen(fileType: string, lineCount: number): string;
  onCodeChange(): string;
  onIdle(): string;
  onSessionMilestone(hours: number): string;
  getClickMessages(): string[];
}
