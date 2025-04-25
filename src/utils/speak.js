export function speak(text, onEnd) {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function speakSequence(messages, onComplete, delay = 500) {
  if (!messages || messages.length === 0) {
    if (onComplete) onComplete();
    return;
  }

  const [first, ...rest] = messages;
  const utterance = new SpeechSynthesisUtterance(first);

  utterance.onend = () => {
    if (rest.length > 0) {
      setTimeout(() => {
        speakSequence(rest, onComplete, delay);
      }, delay);
    } else {
      if (onComplete) onComplete();
    }
  };

  window.speechSynthesis.speak(utterance);
}
