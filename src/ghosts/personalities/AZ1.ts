import { Ghost } from "../Ghost";

export class AZ1 implements Ghost {
  id = "az1";
  name = "AZ1";
  trait = "coffee-lover";
  imagePath = "dark-az-Photoroom.png";

  onError(count: number): string {
    if (count > 10) {
      return "Over 10 errors! This is dangerous...";
    } else if (count > 5) {
      return `Whoa! ${count} errors. Take a deep breath.`;
    } else {
      return `I sense ${count} error(s)... be careful.`;
    }
  }

  onWarning(count: number): string {
    if (count > 5) {
      return "So many warnings!";
    } else if (count > 3) {
      return "3 warnings!! Focus.";
    } else {
      return `Hmm... ${count} warning(s). You sure you wanna ignore those?`;
    }
  }

  onSave(errorCount: number, warningCount: number): string {
    if (errorCount > 0) {
      return `Careful! ${errorCount} error(s) remain after save.`;
    } else if (warningCount > 0) {
      return `${warningCount} warning(s) linger… proceed wisely.`;
    } else {
      return "Nice! You saved without any errors or warnings! Well done.";
    }
  }

  onFileOpen(fileType: string, lineCount: number): string {
    let message = "";

    if (fileType === "ts" || fileType === "js") {
      message = "Ah… JavaScript. ew.";
    } else if (fileType === "cs") {
      message = "C#... good taste.";
    } else if (fileType === "json") {
      message = "A JSON scroll… magic.";
    } else {
      message = `You opened ${fileType}… interesting.`;
    }

    if (lineCount > 1000) {
      message = "This file... is making me dizzy... Do ghosts get dizzy?";
    }

    return message;
  }

  onCodeChange(): string {
    return "Ah! I see new code forming… keep going!";
  }

  getClickMessages(): string[] {
    return [
      "Woah, this coffee is going right through me... literally!",
      "Need some Mate? I always do!",
      "Don't you have something better to do than poke me?",
      "Don't forget to take a break!",
      "This code looks interesting..."
    ];
  }
}
