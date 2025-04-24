export function speak(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

export function speakSequence(messages, delay = 500) {
  if (!messages || messages.length === 0) return;

  const [first, ...rest] = messages;
  const utterance = new SpeechSynthesisUtterance(first);

  utterance.onend = () => {
    setTimeout(() => {
      speakSequence(rest, delay);
    }, delay);
  };

  window.speechSynthesis.speak(utterance);
}
