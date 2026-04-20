# Change Log

All notable changes to the "az-ghosts" extension will be documented in this file.

## [Unreleased] — v0.1.0

### AZ1 Personality
- Randomised message pools for all events — AZ never repeats himself
- Mood system: `happy`, `grumpy`, `tired`, `excited` — shifts based on your session
- Time-of-day awareness — reacts differently at 3am vs 9am
- Repeat error frustration — escalating messages after 3+ saves with errors
- 20+ file type reactions including dotfiles: `.gitignore`, `.env`, `Dockerfile`, lock files, config files, and more
- 15 click messages + poke reactions when clicked while bubble is showing
- Idle detection — pokes you after 3 minutes of no typing
- Session milestones — comments at the 1 hour and 2 hour marks

### Behaviour
- File open and save messages always cut through error message queues (priority system)
- `onCodeChange` debounced — no longer fires on every keystroke
- Messages never interrupt each other — 3 second minimum display time with queue

### UI
- Moved to Explorer sidebar panel (alongside Outline, Timeline)
- Mood-coloured speech bubble border: green (excited), red (grumpy), grey (tired)

### Commands
- `AZ Ghost: Toggle Mute` — silence AZ via the command palette

---

## [0.0.1] — 2026-04-20

- Initial release
