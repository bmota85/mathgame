import { useCallback, useRef } from 'react';

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not available, silent fail
    }
  }, []);

  const playCorrect = useCallback(() => {
    // Happy ascending arpeggio: C5 → E5 → G5
    playTone(523, 0.15, 'sine', 0.3);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 150);
    setTimeout(() => playTone(784, 0.35, 'sine', 0.35), 300);
  }, [playTone]);

  const playWrong = useCallback(() => {
    // Descending minor 2nd: G4 → F#4
    playTone(392, 0.15, 'square', 0.15);
    setTimeout(() => playTone(349, 0.25, 'square', 0.12), 160);
  }, [playTone]);

  const playLevelUp = useCallback(() => {
    // Victory fanfare
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, 'sine', 0.3), i * 130);
    });
  }, [playTone]);

  const playTick = useCallback(() => {
    playTone(880, 0.06, 'sine', 0.12);
  }, [playTone]);

  return { playCorrect, playWrong, playLevelUp, playTick };
}
