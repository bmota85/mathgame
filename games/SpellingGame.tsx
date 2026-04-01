import React, { useState, useEffect, useCallback } from 'react';
import { FlagImage } from '../components/FlagImage';
import { FeedbackOverlay } from '../components/FeedbackOverlay';
import { GameHeader } from '../components/GameHeader';
import { FLAGS_FOR_SPELLING, pickRandom } from '../data/flags';
import { useSound } from '../hooks/useSound';
import type { SessionStats, Level, Flag } from '../types';

interface Props {
  stats: SessionStats;
  level: Level;
  onCorrect: () => void;
  onWrong: () => void;
  onBack: () => void;
}

// ── Letter similarity map for distractors ─────────────────────────────────────
const SIMILAR: Record<string, string[]> = {
  A: ['E', 'O', 'Á'], Á: ['A', 'E', 'O'],
  E: ['A', 'I', 'É'], É: ['E', 'A', 'I'],
  I: ['E', 'Y', 'Í'], Í: ['I', 'E', 'Y'],
  O: ['A', 'U', 'Ó'], Ó: ['O', 'U', 'A'],
  U: ['O', 'I', 'Ú'], Ú: ['U', 'O', 'I'],
  N: ['M', 'Ñ', 'L'], Ñ: ['N', 'M', 'L'],
  R: ['L', 'S', 'D'], L: ['R', 'N', 'I'],
  S: ['C', 'Z', 'X'], C: ['G', 'K', 'S'],
  T: ['D', 'P', 'L'], D: ['T', 'B', 'P'],
  B: ['V', 'P', 'D'], V: ['B', 'F', 'P'],
  G: ['J', 'C', 'Q'], J: ['G', 'H', 'Y'],
  P: ['B', 'T', 'F'], F: ['P', 'V', 'H'],
  H: ['J', 'N', 'G'], M: ['N', 'Ñ', 'B'],
  K: ['C', 'G', 'Q'], Q: ['C', 'K', 'G'],
  X: ['S', 'J', 'Z'], Z: ['S', 'C', 'X'],
  Y: ['I', 'J', 'L'], W: ['V', 'U', 'B'],
};

// ── How many letters to hide per level ───────────────────────────────────────
// Level 1 → 1 letter (last)
// Level 2 → 2 letters (last 2)
// Level 3 → 3 letters (last 3, or scattered if word is long)

function getNumBlanks(level: Level): number {
  return level;
}

function getWordPool(level: Level) {
  const all = FLAGS_FOR_SPELLING;
  if (level === 1) return all.filter(f => f.nameES.length >= 4 && f.nameES.length <= 6);
  if (level === 2) return all.filter(f => f.nameES.length >= 5 && f.nameES.length <= 8);
  return all.filter(f => f.nameES.length >= 6);
}

// ── Build blank positions ─────────────────────────────────────────────────────
function buildBlanks(name: string, numBlanks: number, level: Level): number[] {
  const upper = name.toUpperCase();
  const validIndices = upper.split('').reduce<number[]>((acc, ch, i) => {
    if (ch !== ' ') acc.push(i);
    return acc;
  }, []);

  if (level === 1) {
    // Always hide the last letter
    return [validIndices[validIndices.length - 1]];
  }
  if (level === 2) {
    // Hide last 2 letters
    return validIndices.slice(-2);
  }
  // Level 3: hide last 3, but if word is long hide 1 from middle + 2 from end
  if (upper.replace(' ', '').length > 7) {
    const mid  = validIndices[Math.floor(validIndices.length / 2)];
    const last = validIndices.slice(-2);
    return [mid, ...last].sort((a, b) => a - b);
  }
  return validIndices.slice(-numBlanks);
}

// ── Build letter keyboard ─────────────────────────────────────────────────────
function buildLetters(name: string, blankIndices: number[]): string[] {
  const upper = name.toUpperCase();
  const correctLetters = [...new Set(blankIndices.map(i => upper[i]))];
  const distractors = new Set<string>();

  correctLetters.forEach(ch => {
    const sims = SIMILAR[ch] ?? [];
    sims.forEach(s => {
      if (!correctLetters.includes(s)) distractors.add(s);
    });
  });

  // Ensure we have ~8 buttons total
  const distArr = [...distractors].sort(() => Math.random() - 0.5);
  const needed  = Math.max(0, 8 - correctLetters.length);
  const chosen  = distArr.slice(0, needed);

  return [...correctLetters, ...chosen].sort(() => Math.random() - 0.5);
}

// ── Main component ────────────────────────────────────────────────────────────
export const SpellingGame: React.FC<Props> = ({ stats, level, onCorrect, onWrong, onBack }) => {
  const { playCorrect, playWrong, playTick } = useSound();

  const [flag,         setFlag]         = useState<Flag | null>(null);
  const [blankIndices, setBlankIndices] = useState<number[]>([]);
  const [filled,       setFilled]       = useState<Record<number, string>>({}); // idx → letter
  const [letters,      setLetters]      = useState<string[]>([]);
  const [feedback,     setFeedback]     = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongIdx,     setWrongIdx]     = useState<number | null>(null); // which blank is shaking
  const [revealed,     setRevealed]     = useState(false);

  const nextRound = useCallback(() => {
    const pool = getWordPool(level);
    if (!pool.length) return;
    const [f] = pickRandom(pool, 1);
    const blanks  = buildBlanks(f.nameES, getNumBlanks(level), level);
    const keyboard = buildLetters(f.nameES, blanks);
    setFlag(f);
    setBlankIndices(blanks);
    setFilled({});
    setLetters(keyboard);
    setFeedback('idle');
    setWrongIdx(null);
    setRevealed(false);
  }, [level]);

  useEffect(() => { nextRound(); }, [nextRound]);

  // Which blank position should we fill next?
  const nextBlankPos = blankIndices.find(i => !(i in filled)) ?? null;

  const handleLetter = (letter: string) => {
    if (revealed || nextBlankPos === null || !flag) return;

    const upper    = flag.nameES.toUpperCase();
    const expected = upper[nextBlankPos];

    if (letter === expected) {
      playTick();
      const newFilled = { ...filled, [nextBlankPos]: letter };
      setFilled(newFilled);

      // Check if all blanks are filled
      const allDone = blankIndices.every(i => i in newFilled);
      if (allDone) {
        setRevealed(true);
        setFeedback('correct');
        playCorrect();
        onCorrect();
        setTimeout(() => { setFeedback('idle'); nextRound(); }, 1800);
      }
    } else {
      // Wrong letter
      setWrongIdx(nextBlankPos);
      setFeedback('wrong');
      playWrong();
      onWrong();
      setTimeout(() => {
        setFeedback('idle');
        setWrongIdx(null);
      }, 800);
    }
  };

  if (!flag) return null;

  const upper = flag.nameES.toUpperCase();

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg, #FFF9E6 0%, #F0EFFE 60%, #E8F9F5 100%)' }}>
      <GameHeader stats={stats} onBack={onBack} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', gap: 20 }}>

        {/* Question */}
        <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 'clamp(20px, 5vw, 28px)', color: '#2C2C4E', textAlign: 'center', lineHeight: 1.3 }}>
          🔤 ¿Cómo se llama <span style={{ color: '#FF9F43' }}>este país</span>?
        </div>

        {/* Flag */}
        <div style={{ animation: 'flagPop 0.35s ease-out' }}>
          <FlagImage flagId={flag.id} size="lg" />
        </div>

        {/* Word display */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end' }}>
          {upper.split('').map((ch, i) => {
            const isBlank    = blankIndices.includes(i);
            const isFilled   = isBlank && i in filled;
            const isShaking  = i === wrongIdx;
            const isSpace    = ch === ' ';

            if (isSpace) {
              return <div key={i} style={{ width: 16 }} />;
            }

            return (
              <div
                key={i}
                style={{
                  width:  42,
                  height: 52,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 900,
                  fontSize: 26,
                  transition: 'all 0.15s',
                  animation: isShaking ? 'shake 0.4s ease-out' : undefined,
                  ...(isBlank
                    ? {
                        background: isFilled ? '#6BDB8F' : '#fff',
                        border: isFilled ? '3px solid #4AB871' : `3px solid ${isShaking ? '#FF6B6B' : '#C8C8E0'}`,
                        color: isFilled ? '#fff' : 'transparent',
                        boxShadow: isFilled ? '0 4px 12px rgba(107,219,143,0.3)' : isShaking ? '0 0 0 3px rgba(255,107,107,0.3)' : 'none',
                      }
                    : {
                        background: 'rgba(108,99,255,0.08)',
                        border: '3px solid rgba(108,99,255,0.15)',
                        color: '#2C2C4E',
                      }
                  ),
                }}
              >
                {isBlank ? (isFilled ? filled[i] : '') : ch}
              </div>
            );
          })}
        </div>

        {/* Progress hint */}
        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 14, color: '#B0B0C8', fontWeight: 600 }}>
          {Object.keys(filled).length} de {blankIndices.length} letras encontradas
        </div>

        {/* Fun fact on reveal */}
        {revealed && (
          <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 16, padding: '14px 20px', maxWidth: 360, textAlign: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 15, color: '#6B6B8A', border: '2px solid rgba(255,159,67,0.2)', animation: 'fadeUp 0.3s ease-out' }}>
            💡 {flag.funFact}
          </div>
        )}

        {/* Letter keyboard */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 380, margin: '0 auto' }}>
          {letters.map((letter, i) => {
            const upper2    = flag.nameES.toUpperCase();
            const isCorrect = nextBlankPos !== null && upper2[nextBlankPos] === letter && revealed;

            return (
              <button
                key={i}
                onClick={() => handleLetter(letter)}
                disabled={revealed}
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 16,
                  background: isCorrect ? '#6BDB8F' : 'white',
                  border: `3px solid ${isCorrect ? '#4AB871' : '#E8E8F0'}`,
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 900,
                  fontSize: 26,
                  color: isCorrect ? '#fff' : '#2C2C4E',
                  cursor: revealed ? 'default' : 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'transform 0.1s, background 0.15s',
                  opacity: revealed ? 0.5 : 1,
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={e => {
                  if (!revealed) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
                onMouseDown={e => {
                  if (!revealed) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.94)';
                }}
                onMouseUp={e => {
                  if (!revealed) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
                aria-label={`Letra ${letter}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      <FeedbackOverlay
        show={feedback === 'correct'}
        variant="correct"
        message={`¡${flag.nameES}! 🎉`}
      />

      <style>{`
        @keyframes flagPop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp  { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};
