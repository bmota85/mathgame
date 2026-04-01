// ── Game screens ──────────────────────────────────────────────
export type Screen = 'home' | 'gameSelect' | 'game' | 'results';
export type GameId = 'countColors' | 'countStars' | 'compare' | 'addition';

// ── Difficulty levels (Vygotsky ZPD adaptive) ─────────────────
export type Level = 1 | 2 | 3;

// ── Flag data ─────────────────────────────────────────────────
export interface Flag {
  id: string;
  nameES: string;        // Spanish name
  emoji: string;
  numColors: number;     // Distinct colors visible
  numStars: number;      // Stars / main symbols
  continent: string;
  funFact: string;       // Curiosity hook for the child
}

// ── Session state ─────────────────────────────────────────────
export interface SessionStats {
  correct: number;
  wrong: number;
  maxStreak: number;
  currentStreak: number;
  level: Level;
  gamesPlayed: number;
}

// ── Per-round result ──────────────────────────────────────────
export interface RoundResult {
  correct: boolean;
  answer: number;
  expected: number;
}
