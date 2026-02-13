/**
 * Sound Effects Manager
 * Provides audio feedback for UI interactions
 * 
 * Features:
 * - Click sounds
 * - Hover sounds
 * - Success/error notifications
 * - Volume control
 * - Sound theme selection
 */
class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.3; // Default 30% volume
    this.audioContext = null;
    this.sounds = new Map();
    
    this.init();
  }

  async init() {
    if (typeof window === 'undefined') return;
    
    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      // Create sound generator
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      // Generate different sound types
      this.generateSounds();
      
    } catch (error) {
      console.warn('Sound effects not available:', error);
      this.enabled = false;
    }
  }

  generateSounds() {
    // Click sound (short, pleasant beep)
    this.sounds.set('click', () => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.value = this.volume;
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.05);
      
      return () => {
        try {
          osc.stop();
          gain.disconnect();
          osc.disconnect();
        } catch {
          // Cleanup
        }
      };
    });

    // Hover sound (subtle, warm)
    this.sounds.set('hover', () => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = 600;
      osc.type = 'triangle';
      gain.gain.value = this.volume * 0.3; // Quieter hover sound
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.03);
      
      return () => {
        try {
          osc.stop();
          gain.disconnect();
          osc.disconnect();
        } catch {
          // Cleanup
        }
      };
    });

    // Success sound (ascending, pleasant)
    this.sounds.set('success', () => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = 400;
      osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
      osc.type = 'square';
      gain.gain.value = this.volume * 0.4;
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.15);
      
      return () => {
        try {
          osc.stop();
          gain.disconnect();
          osc.disconnect();
        } catch {
          // Cleanup
        }
      };
    });

    // Error sound (descending, attention-grabbing)
    this.sounds.set('error', () => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = 300;
      osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
      osc.type = 'sawtooth';
      gain.gain.value = this.volume * 0.5;
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.15);
      
      return () => {
        try {
          osc.stop();
          gain.disconnect();
          osc.disconnect();
        } catch {
          // Cleanup
        }
      };
    });

    // Window open sound (whoosh)
    this.sounds.set('windowOpen', () => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = 200;
      osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
      osc.type = 'sine';
      gain.gain.value = this.volume * 0.2;
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.1);
      
      return () => {
        try {
          osc.stop();
          gain.disconnect();
          osc.disconnect();
        } catch {
          // Cleanup
        }
      };
    });

    // Window close sound (soft thud)
    this.sounds.set('windowClose', () => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = 150;
      osc.type = 'sine';
      gain.gain.value = this.volume * 0.3;
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.08);
      
      return () => {
        try {
          osc.stop();
          gain.disconnect();
          osc.disconnect();
        } catch {
          // Cleanup
        }
      };
    });
  }

  play(soundName) {
    if (!this.enabled || !this.sounds.has(soundName)) {
      return null;
    }
    
    try {
      const playSound = this.sounds.get(soundName);
      return playSound();
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
      return null;
    }
  }

  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  destroy() {
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (error) {
        console.warn('Error closing audio context:', error);
      }
      this.audioContext = null;
    }
    this.sounds.clear();
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

export default SoundManager;

