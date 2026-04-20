const vscode = acquireVsCodeApi();
const ghostEl = document.getElementById('az1-ghost');
const bubbleEl = document.getElementById('az1-speech-bubble');

let clickIndex = 0;
let hideTimer;
let queueTimer;
let messageEndTime = 0;
const MIN_DISPLAY_MS = 3000;

function showNow(text, mood) {
  clearTimeout(hideTimer);
  clearTimeout(queueTimer);
  bubbleEl.textContent = text;
  bubbleEl.className = `speech-bubble show mood-${mood ?? 'happy'}`;
  messageEndTime = Date.now() + MIN_DISPLAY_MS;
  hideTimer = setTimeout(() => bubbleEl.classList.remove('show'), 7000);
}

function showMessage(text, mood) {
  const remaining = messageEndTime - Date.now();
  if (remaining > 0) {
    clearTimeout(queueTimer);
    queueTimer = setTimeout(() => showNow(text, mood), remaining);
  } else {
    showNow(text, mood);
  }
}

ghostEl.addEventListener('click', () => {
  showMessage(CLICK_MESSAGES[clickIndex], 'happy');
  clickIndex = (clickIndex + 1) % CLICK_MESSAGES.length;
});

window.addEventListener('message', event => {
  const { type, text, mood } = event.data;
  if (type === 'ghostMessage') showMessage(text, mood);
});
