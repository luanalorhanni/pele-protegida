// "Ouvir a pergunta": leitura em voz alta com a Web Speech API (pt-BR).

export function speechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  );
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.replace('_', '-').toLowerCase() === 'pt-br') ??
    voices.find((v) => v.lang.toLowerCase().startsWith('pt'))
  );
}

// Alguns navegadores (Chrome) carregam as vozes de forma assíncrona.
if (speechSupported()) {
  window.speechSynthesis.getVoices();
}

export function speak(text: string): void {
  if (!speechSupported()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR';
  u.rate = 0.95;
  const voice = pickVoice();
  if (voice) u.voice = voice;
  synth.speak(u);
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}
