// Voice Engine for Ziki Handshake
// Provides browser-native SpeechSynthesis (Agent Voice Output)
// and SpeechRecognition (Human Voice Input) with realistic fallback waveforms.

export class VoiceEngine {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // Play an agent voice briefing using SpeechSynthesis
  public static speak(text: string, agentName: string = 'Gojo', onEnd?: () => void): void {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice parameters based on agent persona
    if (agentName.toLowerCase().includes('six')) {
      utterance.pitch = 0.95;
      utterance.rate = 1.05;
    } else {
      utterance.pitch = 1.1;
      utterance.rate = 1.0;
    }

    // Pick an English voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Generate 20-30 animated waveform bar heights (normalized 0.1 to 1.0)
  public static getWaveform(seed: number = 42, count: number = 28): number[] {
    const bars: number[] = [];
    for (let i = 0; i < count; i++) {
      const val = 0.2 + 0.7 * Math.abs(Math.sin((i + seed) * 0.45));
      bars.push(Math.round(val * 100) / 100);
    }
    return bars;
  }
}
