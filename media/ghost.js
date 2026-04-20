const vscode = acquireVsCodeApi();
const ghostEl = document.getElementById('az1-ghost');
const bubbleEl = document.getElementById('az1-speech-bubble');

let clickIndex = 0;
let hideTimer;

function showMessage(text, mood) {
  clearTimeout(hideTimer);
  bubbleEl.textContent = text;
  bubbleEl.className = `speech-bubble show mood-${mood ?? 'happy'}`;
  hideTimer = setTimeout(() => bubbleEl.classList.remove('show'), 7000);
}

ghostEl.addEventListener('click', () => {
  showMessage(CLICK_MESSAGES[clickIndex], 'happy');
  clickIndex = (clickIndex + 1) % CLICK_MESSAGES.length;
});

window.addEventListener('message', event => {
  const { type, text, mood } = event.data;
  if (type === 'ghostMessage') showMessage(text, mood);
});
