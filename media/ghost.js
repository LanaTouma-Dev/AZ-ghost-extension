const vscode = acquireVsCodeApi();
const ghostElement = document.getElementById('az1-ghost');
const speechBubbleElement = document.getElementById('az1-speech-bubble');

let messageIndex = 0;

ghostElement.addEventListener('click', () => {
  speechBubbleElement.textContent = CLICK_MESSAGES[messageIndex];
  speechBubbleElement.classList.add('show');
  messageIndex = (messageIndex + 1) % CLICK_MESSAGES.length;
  setTimeout(() => speechBubbleElement.classList.remove('show'), 5000);
});

window.addEventListener('message', event => {
  const { type, text } = event.data;
  if (type === 'ghostMessage') {
    speechBubbleElement.textContent = text;
    speechBubbleElement.classList.add('show');
    setTimeout(() => speechBubbleElement.classList.remove('show'), 7000);
  }
});
