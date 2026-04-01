import { useState, useCallback } from 'react';
import type { Level, SessionStats } from '../types';

const INITIAL_STATS: SessionStats = {
  correct: 0,
  wrong: 0,
  maxStreak: 0,
  currentStreak: 0,
  level: 1,
  gamesPlayed: 0,
};

// ZPD thresholds:
// Level up   → 3 consecutive correct answers
// Level down → 2 consecutive wrong answers
const STREAK_UP   = 3;
const STREAK_DOWN = 2;

export function useAdaptive() {
  const [stats, setStats] = useState<SessionStats>(INITIAL_STATS);
  const [justLeveled, setJustLeveled] = useState<'up' | 'down' | null>(null);

  const recordCorrect = useCallback(() => {
    setStats(prev => {
      const newStreak = prev.currentStreak + 1;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);
      const shouldLevelUp = newStreak >= STREAK_UP && prev.level < 3;
      const newLevel: Level = shouldLevelUp ? Math.min(3, prev.level + 1) as Level : prev.level;
      if (shouldLevelUp) setJustLeveled('up');
      return {
        ...prev,
        correct: prev.correct + 1,
        currentStreak: shouldLevelUp ? 0 : newStreak,
        maxStreak: newMaxStreak,
        level: newLevel,
      };
    });
  }, []);

  const recordWrong = useCallback(() => {
    setStats(prev => {
      // Count consecutive wrongs by looking at the negative streak
      const wrongStreak = prev.currentStreak < 0 ? prev.currentStreak - 1 : -1;
      const shouldLevelDown = wrongStreak <= -STREAK_DOWN && prev.level > 1;
      const newLevel: Level = shouldLevelDown ? Math.max(1, prev.level - 1) as Level : prev.level;
      if (shouldLevelDown) setJustLeveled('down');
      return {
        ...prev,
        wrong: prev.wrong + 1,
        currentStreak: shouldLevelDown ? 0 : wrongStreak,
        level: newLevel,
      };
    });
  }, []);

  const incrementGames = useCallback(() => {
    setStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    setJustLeveled(null);
  }, []);

  const reset = useCallback(() => {
    setStats(INITIAL_STATS);
    setJustLeveled(null);
  }, []);

  return { stats, justLeveled, recordCorrect, recordWrong, incrementGames, reset };
}
