export type Screen = 'home' | 'gameSelect' | 'game' | 'results';
export type GameId = 'countColors' | 'countStars' | 'compare' | 'addition' | 'spelling';
export type Level = 1 | 2 | 3;

export interface Flag {
  id: string;
  nameES: string;
  emoji: string;
  numColors: number;
  numStars: number;
  continent: string;
  funFact: string;
}

export interface SessionStats {
  correct: number;
  wrong: number;
  maxStreak: number;
  currentStreak: number;
  level: Level;
  gamesPlayed: number;
}

export interface RoundResult {
  correct: boolean;
  answer: number;
  expected: number;
}
