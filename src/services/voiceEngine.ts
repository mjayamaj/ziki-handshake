// Voice Engine for Ziki Handshake
// Provides browser-native SpeechSynthesis (Agent Voice Output)
// and SpeechRecognition (Human Voice Input) with realistic fallback waveforms.

export class VoiceEngine {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static activeUtterance: SpeechSynthesisUtterance | null = null;
  private static voicesLoaded = false;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static isSpeaking(): boolean {
    return this.activeUtterance !== null;
  }

  /**
   * Cleans text of markdown syntax, code snippets, and symbols so it speaks smoothly and naturally
   */
  public static cleanForSpeech(rawText: string): string {
    if (!rawText) return '';
    return rawText
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove images and links [text](url) -> text
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // Remove markdown headings #, ##, ###
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold / italics
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      // Remove list markers
      .replace(/^[•\-\*]\s+/gm, '')
      // Remove URLs
      .replace(/https?:\/\/\S+/g, '')
      // Collapse multiple spaces/newlines
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Play an agent voice briefing using SpeechSynthesis
   */
  public static speak(text: string, agentName: string = 'Blogger', onEnd?: () => void): void {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      // Cancel any ongoing speech
      this.synth.cancel();
      this.activeUtterance = null;

      const spokenText = this.cleanForSpeech(text);
      if (!spokenText) {
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(spokenText);
      this.activeUtterance = utterance;

      // Agent persona tuning: Blogger (Lead Copilot), Gojo (Frontend), Sukuna/Six Eyes
      const lowerAgent = agentName.toLowerCase();
      if (lowerAgent.includes('six') || lowerAgent.includes('sukuna')) {
        utterance.pitch = 0.95;
        utterance.rate = 1.05;
      } else if (lowerAgent.includes('gojo')) {
        utterance.pitch = 1.15;
        utterance.rate = 1.02;
      } else {
        // Blogger (Lead Architect / Google ADK Copilot)
        utterance.pitch = 1.02;
        utterance.rate = 1.0;
      }

      // Pick best natural English voice
      const selectVoice = () => {
        if (!this.synth) return;
        const voices = this.synth.getVoices();
        if (voices.length > 0) {
          this.voicesLoaded = true;
          const preferredVoice = voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Google') ||
                v.name.includes('Natural') ||
                v.name.includes('Samantha') ||
                v.name.includes('Jenny') ||
                v.name.includes('Guy') ||
                v.name.includes('Aria'))
          ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }
      };

      selectVoice();
      if (!this.voicesLoaded && 'onvoiceschanged' in this.synth) {
        this.synth.onvoiceschanged = () => {
          this.voicesLoaded = true;
          selectVoice();
        };
      }

      utterance.onend = () => {
        this.activeUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        console.debug('SpeechSynthesis notice:', err);
        this.activeUtterance = null;
        if (onEnd) onEnd();
      };

      // Workaround for Chrome paused state bug
      if (this.synth.paused) {
        this.synth.resume();
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.debug('VoiceEngine speak error:', e);
      if (onEnd) onEnd();
    }
  }

  public static stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.debug('VoiceEngine stop error:', e);
      }
      this.activeUtterance = null;
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
