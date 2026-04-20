import { Ghost } from "../Ghost";
import { pickRandom } from "../../utils/random";
import { getTimeSlot } from "../../utils/time";

type Mood = 'happy' | 'grumpy' | 'tired' | 'excited';
type MoodPools = Partial<Record<Mood, string[]>> & { default: string[] };

function pickMooded(pools: MoodPools, mood: Mood): string {
  return pickRandom(pools[mood] ?? pools.default);
}

export class AZ1 implements Ghost {
  id = "az1";
  name = "AZ";
  trait = "coffee-lover";
  imagePath = "dark-az-Photoroom.png";

  private mood: Mood = 'happy';
  private cleanSaveStreak = 0;

  getMood(): Mood {
    return this.mood;
  }

  private updateMood(trigger: 'error' | 'warning' | 'clean-save'): void {
    if (getTimeSlot() === 'deep-night') {
      this.mood = 'tired';
      return;
    }
    switch (trigger) {
      case 'error':
        this.mood = 'grumpy';
        this.cleanSaveStreak = 0;
        break;
      case 'clean-save':
        this.cleanSaveStreak++;
        this.mood = this.cleanSaveStreak >= 3 ? 'excited' : 'happy';
        break;
      case 'warning':
        if (this.mood !== 'grumpy') this.mood = 'happy';
        break;
    }
  }

  onError(count: number): string {
    this.updateMood('error');

    if (count > 10) {
      return pickRandom([
        "Over 10 errors. I can't even look.",
        "This is a disaster. Over 10 errors.",
        "10+ errors? That's not coding, that's chaos.",
        "I'm going to need more coffee for this.",
      ]);
    }

    const pools: MoodPools = {
      default: [
        `I sense ${count} error(s)... be careful.`,
        `${count} error(s)? That's not great.`,
        `Hmm. ${count} error(s). You sure about this?`,
        `Something's broken. ${count} error(s) to go.`,
      ],
      grumpy: [
        `${count} errors. Again. Fix them.`,
        `Still ${count} errors? Really now.`,
        `${count} errors. Unacceptable.`,
        `You introduced MORE errors. Congratulations.`,
      ],
      tired: [
        `${count} errors... at this hour...`,
        `errors at ${new Date().getHours()}am. truly a nightmare.`,
        `can't even process ${count} errors right now...`,
      ],
      excited: [
        `Whoa, ${count} error(s)! You can squash them though!`,
        `${count} errors — nothing you can't handle!`,
      ],
    };
    return pickMooded(pools, this.mood);
  }

  onWarning(count: number): string {
    this.updateMood('warning');

    const pools: MoodPools = {
      default: [
        `${count} warning(s)... you sure you wanna ignore those?`,
        `Hmm, ${count} warning(s). I'd look into that.`,
        `${count} warning(s) lurking around. Just saying.`,
        `Warnings don't fix themselves. Just so you know.`,
      ],
      grumpy: [
        `${count} warnings on top of everything else. Lovely.`,
        `Warnings AND errors? Impressive chaos.`,
        `${count} warnings. Sure, ignore them. What could go wrong.`,
      ],
      tired: [
        `${count} warnings... deal with them tomorrow maybe...`,
        `warnings at this hour. a bold choice.`,
      ],
      excited: [
        `Just ${count} warning(s)? Practically clean!`,
        `${count} warning(s) — tiny stuff, you've got this!`,
      ],
    };
    return pickMooded(pools, this.mood);
  }

  onSave(errorCount: number, warningCount: number): string {
    if (errorCount > 0) {
      this.updateMood('error');
      const pools: MoodPools = {
        default: [
          `Saved, but ${errorCount} error(s) remain. Careful.`,
          `${errorCount} error(s) survived the save. Don't ship this.`,
          `You saved. The errors did not leave.`,
        ],
        grumpy: [
          `${errorCount} errors. Still. After saving. Great.`,
          `Saved with errors. Bold strategy.`,
          `The errors are still there. Shocking, I know.`,
        ],
        tired: [
          `${errorCount} errors... saving didn't fix them... shockingly...`,
          `still errors... go to sleep and fix them tomorrow...`,
        ],
        excited: [
          `${errorCount} errors still hanging around! You'll get them!`,
        ],
      };
      return pickMooded(pools, this.mood);
    }

    if (warningCount > 0) {
      this.updateMood('warning');
      const pools: MoodPools = {
        default: [
          `${warningCount} warning(s) linger… proceed wisely.`,
          `Saved clean-ish. ${warningCount} warning(s) watching you.`,
          `Almost perfect. ${warningCount} warning(s) disagree.`,
        ],
        grumpy: [
          `Saved. ${warningCount} warnings still there. You're welcome.`,
          `Warnings don't care that you saved.`,
        ],
        tired: [
          `warnings still up... at least you saved...`,
        ],
        excited: [
          `So close! Just ${warningCount} warning(s) left!`,
          `Nearly spotless! Knock out those ${warningCount} warning(s)!`,
        ],
      };
      return pickMooded(pools, this.mood);
    }

    this.updateMood('clean-save');
    const pools: MoodPools = {
      default: [
        "Clean save. Nice work.",
        "No errors, no warnings. That's the way.",
        "Saved perfectly. I approve.",
        "Zero issues. Satisfying.",
      ],
      happy: [
        "Clean save! Keep it up.",
        "Zero errors. Zero warnings. Beautiful.",
        "That's what I like to see.",
      ],
      excited: [
        `${this.cleanSaveStreak} clean saves in a row! You're on fire!`,
        "CLEAN SAVE AGAIN! You're absolutely cooking!",
        "Another perfect save! I can't contain myself!",
        `${this.cleanSaveStreak} in a row. Unstoppable.`,
      ],
      tired: [
        "saved... clean too... good...",
        "no errors... that's something... rest soon...",
      ],
    };
    return pickMooded(pools, this.mood);
  }

  onFileOpen(fileType: string, lineCount: number): string {
    if (lineCount > 1000) {
      return pickRandom([
        "This file is making me dizzy... do ghosts get dizzy?",
        `${lineCount} lines. Who hurt you.`,
        "I refuse to read this whole file.",
        `${lineCount} lines in one file. Brave.`,
      ]);
    }

    const reactions: Record<string, string[]> = {
      ts:    ["TypeScript. Respectable.", "At least it's not plain JS.", "Strong types. Smart move."],
      js:    ["JavaScript. Ew.", "JS? Really?", "Ah yes, the chaos language.", "JavaScript again. Sure."],
      jsx:   ["JSX? Worse than plain JS, somehow.", "React... fine, I guess.", "JSX. I'll allow it. Barely."],
      tsx:   ["TSX. JS and JSX had a baby. Still ew.", "At least there's TypeScript in there.", "TSX... the lesser evil."],
      py:    ["Python. Nice choice.", "Ah, Python. Elegant.", "A person of culture.", "Python. Clean and readable."],
      rs:    ["Rust. I respect you and I fear you.", "Fighting the borrow checker again?", "Rust. Dangerous territory.", "Rust dev? Respect."],
      cs:    ["C#. Good taste.", "Now we're talking.", "A fellow C# enjoyer.", "C#. My favorite honestly."],
      go:    ["Go. Simple. Honest.", "Golang. No-nonsense, I like it.", "Go code. Gets the job done."],
      java:  ["Java. Verbose as ever.", "EnterpriseFactoryBeanManagerImpl.java?", "Java... don't forget to close your streams."],
      kt:    ["Kotlin! Smart choice.", "Kotlin — Java but actually good.", "Ah, Kotlin. You have taste."],
      html:  ["HTML. Not exactly code, but okay.", "Ah, the skeleton of the web.", "Angle brackets as far as the eye can see."],
      css:   ["CSS. I feel your pain.", "May your flexbox be centered.", "The cascade giveth and the cascade taketh away."],
      scss:  ["SCSS. At least you made CSS bearable.", "Variables in CSS. Civilized.", "SCSS — brave attempt at fixing CSS."],
      md:    ["Taking notes. Good habit.", "Documentation? Look at you.", "Markdown. Words for humans."],
      json:  ["A JSON scroll. Magical.", "Key-value incantations. Classic.", "JSON. The universal language."],
      yaml:  ["YAML. Indentation crimes await.", "One wrong space and it all falls apart.", "YAML — where whitespace is law."],
      sql:   ["Ah, the ancient tongue.", "SQL. Timeless.", "Querying the depths.", "JOIN me in appreciation of SQL."],
      cpp:   ["C++. You are brave.", "Manual memory management? Godspeed.", "C++... I'll pray for you."],
      c:     ["Raw C. You have my respect.", "Close to the metal. I like it.", "C code. No hand-holding here."],
      php:   ["...php.", "No comment.", "I'll pretend I didn't see that.", "php. okay."],
      rb:    ["Ruby! Charming as ever.", "Ah, Ruby. A delight.", "Ruby code. Reads like poetry."],
      swift: ["Swift. Apple's finest.", "iOS dev? Respect.", "Swift. Clean and fast."],
      vue:   ["Vue! A wholesome choice.", "Vue components. Cozy.", "Vue.js. I can respect this."],
      svelte:["Svelte! Interesting choice.", "No virtual DOM? Bold.", "Svelte. Ahead of its time."],
    };

    const lines = reactions[fileType] ?? [
      `${fileType} file. Interesting.`,
      `Opening .${fileType}? Bold choice.`,
      `Never seen a .${fileType} before. I'm watching.`,
    ];

    const reaction = pickRandom(lines);

    const timeSlot = getTimeSlot();
    const timeSuffix: Partial<Record<typeof timeSlot, string[]>> = {
      'deep-night': ["...at 3am.", "...at this hour?", "...in the dead of night."],
      'morning':    ["Bright and early.", "Morning grind, I respect it."],
    };

    const suffix = timeSuffix[timeSlot];
    const shouldAddTime = suffix && Math.random() < 0.25;
    return shouldAddTime ? `${reaction} ${pickRandom(suffix)}` : reaction;
  }

  onCodeChange(): string {
    const pools: MoodPools = {
      default: [
        "New code forming...",
        "I see what you're building.",
        "Interesting approach.",
        "Keep going.",
        "Something taking shape here.",
      ],
      grumpy: [
        "More code. Sure.",
        "Writing more of... that.",
        "I'll withhold judgment.",
        "Okay.",
      ],
      tired: [
        "still coding...",
        "keys clicking at this hour...",
        "new code... sure...",
      ],
      excited: [
        "Oh! Something new! Keep going!",
        "Yes! I see it coming together!",
        "Writing something good? I can feel it!",
        "More code! Don't stop!",
      ],
    };
    return pickMooded(pools, this.mood);
  }

  getClickMessages(): string[] {
    return [
      "This coffee is going right through me... literally.",
      "Need some Mate? I always do.",
      "Don't you have code to write?",
      "Don't forget to take a break.",
      "You good? Drink some water.",
      "I haunt this sidebar for free, you know.",
      "I've seen your commit messages. No comment.",
      "Close your unused tabs. Please. For me.",
      "That last function? Chef's kiss.",
      "Have you considered... naming your variables better?",
      "I'm not a rubber duck, but I'll listen.",
      "You've been staring at this screen for a while now.",
      "The bug is probably in the last place you'd look.",
      "git commit -m 'fix' is not a commit message.",
      "I believe in you. Mostly.",
    ];
  }
}
