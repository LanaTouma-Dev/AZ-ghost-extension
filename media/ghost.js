const vscode = acquireVsCodeApi();
const ghostEl  = document.getElementById('az1-ghost');
const bubbleEl = document.getElementById('az1-speech-bubble');
let clickIndex = 0;
let pokeIndex  = 0;
let hideTimer;
let queueTimer;
let messageEndTime = 0;
let muted = false;

const MIN_DISPLAY_MS = 3000;

const POKE_MESSAGES = [
  "hey!",
  "don't poke me.",
  "I'm trying to watch you code.",
  "what do you want.",
  "again??",
  "I felt that.",
  "...",
  "stop.",
  "I'm a ghost, not a button.",
  "okay OKAY I see you.",
];

function showNow(text, mood) {
  clearTimeout(hideTimer);
  clearTimeout(queueTimer);
  bubbleEl.textContent = text;
  bubbleEl.className = `speech-bubble show mood-${mood ?? 'happy'}`;
  messageEndTime = Date.now() + MIN_DISPLAY_MS;
  hideTimer = setTimeout(() => bubbleEl.classList.remove('show'), 7000);
}

function showMessage(text, mood, priority) {
  if (priority === 'high') {
    showNow(text, mood);
    return;
  }
  const remaining = messageEndTime - Date.now();
  if (remaining > 0) {
    clearTimeout(queueTimer);
    queueTimer = setTimeout(() => showNow(text, mood), remaining);
  } else {
    showNow(text, mood);
  }
}

ghostEl.addEventListener('click', () => {
  if (bubbleEl.classList.contains('show')) {
    showNow(POKE_MESSAGES[pokeIndex % POKE_MESSAGES.length], 'grumpy');
    pokeIndex++;
  } else {
    showNow(CLICK_MESSAGES[clickIndex % CLICK_MESSAGES.length], 'happy');
    clickIndex++;
  }
});

window.addEventListener('message', event => {
  const { type, text, mood, priority } = event.data;
  if (type === 'ghostMessage') {
    showMessage(text, mood, priority);
  } else if (type === 'muteChange') {
    muted = event.data.muted;
  }
});
