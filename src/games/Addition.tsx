import React, { useState, useEffect, useCallback } from 'react';
import { FlagDisplay } from '../components/FlagImage';
import { NumberPad } from '../components/NumberPad';
import { FeedbackOverlay } from '../components/FeedbackOverlay';
import { GameHeader } from '../components/GameHeader';
import { FLAGS_FOR_ADDITION, FLAG_BY_ID, pickUnique as pickRandom } from '../data/flags';
import { useSound } from '../hooks/useSound';
import type { SessionStats, Level, Flag } from '../types';

interface Props {
  stats: SessionStats;
  level: Level;
  onCorrect: () => void;
  onWrong: () => void;
  onBack: () => void;
}

// Level 1 → sum ≤ 5  (both flags have 2–3 colors)
// Level 2 → sum ≤ 7
// Level 3 → sum ≤ 8

function getPair(level: Level): { a: Flag; b: Flag } | null {
  const maxSum = level === 1 ? 5 : level === 2 ? 7 : 8;
  const pool = FLAGS_FOR_ADDITION;

  for (let i = 0; i < 30; i++) {
    const [a, b] = pickRandom(pool, 2);
    if (a.numColors + b.numColors <= maxSum) return { a, b };
  }
  return null;
}

function getMaxAnswer(level: Level) {
  if (level === 1) return 6;
  if (level === 2) return 8;
  return 9;
}

export const Addition: React.FC<Props> = ({ stats, level, onCorrect, onWrong, onBack }) => {
  const { playCorrect, playWrong } = useSound();
  const [pair, setPair]           = useState<{ a: Flag; b: Flag } | null>(null);
  const [selected, setSelected]   = useState<number | null>(null);
  const [feedback, setFeedback]   = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [revealed, setRevealed]   = useState(false);
  // Show visual decomposition after reveal
  const [showBreakdown, setShowBreakdown] = useState(false);

  const nextRound = useCallback(() => {
    const p = getPair(level);
    setPair(p);
    setSelected(null);
    setFeedback('idle');
    setRevealed(false);
    setShowBreakdown(false);
  }, [level]);

  useEffect(() => { nextRound(); }, [nextRound]);

  if (!pair) return null;

  const { a, b } = pair;
  const answer = a.numColors + b.numColors;

  const handleAnswer = (n: number) => {
    if (revealed) return;
    const correct = n === answer;
    setSelected(n);
    setRevealed(true);
    setFeedback(correct ? 'correct' : 'wrong');
    setTimeout(() => setShowBreakdown(true), 200);

    if (correct) { playCorrect(); onCorrect(); }
    else          { playWrong();  onWrong(); }

    setTimeout(() => {
      setFeedback('idle');
      nextRound();
    }, correct ? 1800 : 2400);
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg, #FFE8E8 0%, #FFF9E6 50%, #F0EFFE 100%)' }}>
      <GameHeader stats={stats} onBack={onBack} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 20px',
          gap: 22,
        }}
      >
        {/* Question */}
        <div
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(20px, 5vw, 28px)',
            color: '#2C2C4E',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          ➕ ¿Cuántos colores hay{' '}
          <span style={{ color: '#FF6B6B' }}>en total</span>?
        </div>

        {/* Two flags + plus sign */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {/* Flag A */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <FlagDisplay flagId={a.id} size="md" />
            <div
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: 16,
                color: '#6B6B8A',
              }}
            >
              {a.nameES}
            </div>
            {/* Reveal color count */}
            {showBreakdown && (
              <div
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 900,
                  fontSize: 26,
                  color: '#6C63FF',
                  animation: 'popIn 0.25s ease-out',
                }}
              >
                {a.numColors} 🎨
              </div>
            )}
          </div>

          {/* Plus sign */}
          <div
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: 52,
              color: '#FF6B6B',
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 8px rgba(255,107,107,0.3))',
            }}
          >
            +
          </div>

          {/* Flag B */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <FlagDisplay flagId={b.id} size="md" />
            <div
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: 16,
                color: '#6B6B8A',
              }}
            >
              {b.nameES}
            </div>
            {showBreakdown && (
              <div
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 900,
                  fontSize: 26,
                  color: '#6C63FF',
                  animation: 'popIn 0.25s ease-out',
                }}
              >
                {b.numColors} 🎨
              </div>
            )}
          </div>
        </div>

        {/* Breakdown equation revealed */}
        {showBreakdown && (
          <div
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(24px, 6vw, 36px)',
              color: '#2C2C4E',
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 20,
              padding: '16px 32px',
              border: '3px solid rgba(108,99,255,0.15)',
              animation: 'popIn 0.25s ease-out',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ color: '#6C63FF' }}>{a.numColors}</span>
            <span style={{ color: '#FF6B6B', margin: '0 10px' }}>+</span>
            <span style={{ color: '#6C63FF' }}>{b.numColors}</span>
            <span style={{ color: '#888', margin: '0 10px' }}>=</span>
            <span style={{ color: '#4ECDC4' }}>{answer}</span>
            <span style={{ marginLeft: 8 }}>🎨</span>
          </div>
        )}

        {/* Fun fact */}
        {revealed && !showBreakdown && null}
        {showBreakdown && (
          <div
            style={{
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 14,
              padding: '12px 18px',
              maxWidth: 360,
              textAlign: 'center',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 600,
              fontSize: 15,
              color: '#6B6B8A',
              border: '2px solid rgba(255,107,107,0.15)',
            }}
          >
            💡 {FLAG_BY_ID[a.id]?.funFact}
          </div>
        )}

        {/* Number pad */}
        <NumberPad
          min={2}
          max={getMaxAnswer(level)}
          onSelect={handleAnswer}
          disabled={revealed}
          correct={revealed ? answer : null}
          selected={selected}
        />
      </div>

      <FeedbackOverlay
        show={feedback !== 'idle'}
        variant={feedback === 'correct' ? 'correct' : 'wrong'}
        message={
          feedback === 'correct'
            ? `¡${a.numColors} + ${b.numColors} = ${answer}!`
            : `Son ${answer} en total`
        }
      />

      <style>{`
        @keyframes popIn  { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};
