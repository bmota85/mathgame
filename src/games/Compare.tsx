import React, { useState, useEffect, useCallback } from 'react';
import { FlagDisplay } from '../components/FlagImage';
import { FeedbackOverlay } from '../components/FeedbackOverlay';
import { GameHeader } from '../components/GameHeader';
import { FLAGS_FOR_COMPARE, FLAG_BY_ID, pickRandom } from '../data/flags';
import { useSound } from '../hooks/useSound';
import type { SessionStats, Level, Flag } from '../types';

interface Props {
  stats: SessionStats;
  level: Level;
  onCorrect: () => void;
  onWrong: () => void;
  onBack: () => void;
}

// Level 1 → compare numColors, big difference (≥ 2)
// Level 2 → compare numColors, any difference
// Level 3 → compare numStars OR numColors, alternating

type Metric = 'colors' | 'stars';

function getPair(level: Level): { a: Flag; b: Flag; metric: Metric } | null {
  const metric: Metric = level === 3 && Math.random() > 0.5 ? 'stars' : 'colors';
  const pool = metric === 'colors'
    ? FLAGS_FOR_COMPARE.filter(f => f.numColors >= 2)
    : FLAGS_FOR_COMPARE.filter(f => f.numStars >= 1);

  if (pool.length < 2) return null;

  // Try up to 20 times to find a pair with a meaningful difference
  for (let i = 0; i < 20; i++) {
    const [a, b] = pickRandom(pool, 2);
    const va = metric === 'colors' ? a.numColors : a.numStars;
    const vb = metric === 'colors' ? b.numColors : b.numStars;
    if (va === vb) continue; // need a clear winner
    if (level === 1 && Math.abs(va - vb) < 2) continue; // easy level needs bigger gap
    return { a, b, metric };
  }
  return null;
}

export const Compare: React.FC<Props> = ({ stats, level, onCorrect, onWrong, onBack }) => {
  const { playCorrect, playWrong } = useSound();
  const [pair, setPair]           = useState<{ a: Flag; b: Flag; metric: Metric } | null>(null);
  const [selected, setSelected]   = useState<string | null>(null); // flagId
  const [feedback, setFeedback]   = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [revealed, setRevealed]   = useState(false);

  const nextRound = useCallback(() => {
    const p = getPair(level);
    setPair(p);
    setSelected(null);
    setFeedback('idle');
    setRevealed(false);
  }, [level]);

  useEffect(() => { nextRound(); }, [nextRound]);

  if (!pair) return null;

  const { a, b, metric } = pair;
  const va = metric === 'colors' ? a.numColors : a.numStars;
  const vb = metric === 'colors' ? b.numColors : b.numStars;
  const winnerId = va > vb ? a.id : b.id;
  const metricLabel = metric === 'colors' ? 'colores' : 'estrellas';
  const metricEmoji = metric === 'colors' ? '🎨' : '⭐';

  const handlePick = (flagId: string) => {
    if (revealed) return;
    setSelected(flagId);
    setRevealed(true);

    const correct = flagId === winnerId;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) { playCorrect(); onCorrect(); }
    else          { playWrong();  onWrong(); }

    setTimeout(() => {
      setFeedback('idle');
      nextRound();
    }, correct ? 1600 : 2200);
  };

  const winnerFlag = FLAG_BY_ID[winnerId];

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg, #E0FFF8 0%, #F0EFFE 100%)' }}>
      <GameHeader stats={stats} onBack={onBack} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 20px',
          gap: 28,
        }}
      >
        {/* Question */}
        <div
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(22px, 5.5vw, 30px)',
            color: '#2C2C4E',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          {metricEmoji} ¿Cuál bandera tiene{' '}
          <span style={{ color: '#4ECDC4' }}>más {metricLabel}</span>?
        </div>

        {/* Two flags side by side */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {[a, b].map(flag => {
            const val = metric === 'colors' ? flag.numColors : flag.numStars;
            const isWinner   = flag.id === winnerId;
            const isSelected = flag.id === selected;
            const isLoser    = revealed && !isWinner;

            return (
              <button
                key={flag.id}
                onClick={() => handlePick(flag.id)}
                disabled={revealed}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: revealed ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  padding: 12,
                  borderRadius: 24,
                  transition: 'transform 0.15s',
                  transform: revealed
                    ? isWinner
                      ? 'scale(1.08)'
                      : 'scale(0.92)'
                    : 'scale(1)',
                  opacity: revealed && isLoser ? 0.5 : 1,
                  outline: 'none',
                }}
                aria-label={`Elegir ${flag.nameES}`}
              >
                <FlagDisplay
                  flagId={flag.id}
                  size="md"
                  selected={isSelected && !revealed ? true : revealed && isWinner}
                />
                <div
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 800,
                    fontSize: 18,
                    color: '#2C2C4E',
                  }}
                >
                  {flag.nameES}
                </div>
                {/* Reveal value after answer */}
                {revealed && (
                  <div
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 900,
                      fontSize: 22,
                      color: isWinner ? '#4ECDC4' : '#FF6B6B',
                      animation: 'fadeUp 0.3s ease-out',
                    }}
                  >
                    {metricEmoji} {val}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Fun fact after reveal */}
        {revealed && (
          <div
            style={{
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 16,
              padding: '14px 20px',
              maxWidth: 380,
              textAlign: 'center',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 600,
              fontSize: 16,
              color: '#6B6B8A',
              border: '2px solid rgba(78,205,196,0.25)',
              animation: 'fadeUp 0.3s ease-out',
            }}
          >
            💡 {winnerFlag?.funFact}
          </div>
        )}

        {/* Tap prompt */}
        {!revealed && (
          <div
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: 15,
              color: '#B0B0C8',
              fontWeight: 600,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            👆 Toca la bandera ganadora
          </div>
        )}
      </div>

      <FeedbackOverlay
        show={feedback !== 'idle'}
        variant={feedback === 'correct' ? 'correct' : 'wrong'}
        message={
          feedback === 'correct'
            ? '¡Correcto!'
            : `${winnerFlag?.nameES} tiene más`
        }
      />

      <style>{`
        @keyframes fadeUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};
