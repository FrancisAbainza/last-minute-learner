export function speak(text: string) {
  speechSynthesis.cancel();
  const voices = speechSynthesis.getVoices();
  const utterance = new SpeechSynthesisUtterance(
    text
  );

  utterance.voice =
    voices.find((voice) => voice.name.includes("English")) ?? null;
  
  speechSynthesis.speak(utterance);
};