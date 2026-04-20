# AZ Ghost — VS Code Extension

> A mischievous little ghost that haunts your sidebar and reacts to everything you do.

![AZ Ghost in action](media/dark-az-Photoroom.png)

---

## Meet AZ

AZ is a coffee-loving ghost who floats in your VS Code sidebar and has *opinions* about your code. He reacts to errors, warnings, saves, file opens, and idle moments, with a personality that shifts depending on how your session is going.

He's got moods. He notices what time it is and  he remembers your clean save streak.

---

## Features

- **Mood system** — AZ cycles through `happy`, `grumpy`, `tired`, and `excited` based on your session. Three clean saves in a row? He gets hyped. 10+ errors? He gets blunt.
- **Event reactions** — responds to errors, warnings, saves, file opens, and code changes
- **20+ file type reactions** — from Rust ("I respect you and I fear you") to PHP ("...php.")
- **Time-of-day awareness** — catches you coding at 3am and has something to say about it
- **Click to chat** — click AZ for a random quip. He's got 15 of them.
- **Non-interrupting messages** — new messages queue politely, never cutting off what you're reading
- **Theme-aware** — adapts to your VS Code color theme

---

## Installation

### From VSIX (latest release)

1. Download `az-ghosts-x.x.x.vsix` from the [Releases](../../releases) page
2. Open VS Code → Extensions panel (`Ctrl+Shift+X`)
3. Click `...` → **Install from VSIX...**
4. Select the downloaded file

AZ will appear as a collapsible panel in the Explorer sidebar (`Ctrl+Shift+E`), alongside Outline and Timeline.

---

## What's Next

AZ is the first ghost — but not the last.

The plan is to build out a full roster of ghosts, each with a distinct personality, visual style, and way of reacting to your code. Some ideas already brewing:

- A ghost who only speaks in passive-aggressive encouragement
- A dramatic ghost who treats every error like a tragedy
- A sleepy ghost who's barely paying attention
- A ghost who's weirdly enthusiastic about unit tests

**Want to design one?** Open an issue with your ghost concept, personality, trait, and a few sample lines.

---

## Contributing

Contributions are very welcome. Whether it's a new ghost personality, better messages for AZ, bug fixes, or UI improvements — open a PR.

```
git clone https://github.com/LanaTouma-Dev/AZ-ghost-extension
cd AZ-ghost-extension
npm install
# Hit F5 in VS Code to launch the Extension Development Host
```

If you're adding messages or personalities, keep the voice consistent please! AZ is dry, opinionated, and fond of coffee. He's not mean, just a little haunted.

---

## License

MIT
