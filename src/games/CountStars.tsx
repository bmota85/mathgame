import React, { useState, useEffect, useCallback } from 'react';
import { FlagDisplay } from '../components/FlagImage';
import { NumberPad } from '../components/NumberPad';
import { FeedbackOverlay } from '../components/FeedbackOverlay';
import { GameHeader } from '../components/GameHeader';
import { FLAGS_FOR_COUNT_STARS, FLAG_BY_ID, pickRandom } from '../data/flags';
import { useSound } from '../hooks/useSound';
import type { SessionStats, Level } from '../types';

interface Props {
  stats: SessionStats;
  level: Level;
  onCorrect: () => void;
  onWrong: () => void;
  onBack: () => void;
}

// Level-gated pools (by numStars):
// Level 1 → 1 star
// Level 2 → 1–3 stars
// Level 3 → 1–6 stars

function getPool(level: Level) {
  if (level === 1) return FLAGS_FOR_COUNT_STARS.filter(f => f.numStars === 1);
  if (level === 2) return FLAGS_FOR_COUNT_STARS.filter(f => f.numStars <= 3);
  return FLAGS_FOR_COUNT_STARS;
}

function getMaxAnswer(level: Level) {
  if (level === 1) return 3;
  if (level === 2) return 5;
  return 7;
}

// Symbol label: some flags use circles or crosses, not just stars
function getSymbolLabel(flagId: string): string {
  if (flagId === 'jp') return 'círculos rojos';
  if (flagId === 'tr') return 'estrellas';
  if (flagId === 'ch') return 'cruces blancas';
  if (flagId === 'no' || flagId === 'se' || flagId === 'gr') return 'cruces';
  return 'estrellas';
}

export const CountStars: React.FC<Props> = ({ stats, level, onCorrect, onWrong, onBack }) => {
  const { playCorrect, playWrong } = useSound();
  const [flagId, setFlagId]       = useState('');
  const [selected, setSelected]   = useState<number | null>(null);
  const [feedback, setFeedback]   = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [revealed, setRevealed]   = useState(false);

  const nextFlag = useCallback(() => {
    const pool = getPool(level);
    if (pool.length === 0) return;
    const [f] = pickRandom(pool, 1);
    setFlagId(f.id);
    setSelected(null);
    setFeedback('idle');
    setRevealed(false);
  }, [level]);

  useEffect(() => { nextFlag(); }, [nextFlag]);

  const handleAnswer = (n: number) => {
    if (revealed) return;
    const flag = FLAG_BY_ID[flagId];
    if (!flag) return;
    const correct = flag.numStars === n;
    setSelected(n);
    setRevealed(true);
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      playCorrect();
      onCorrect();
    } else {
      playWrong();
      onWrong();
    }

    setTimeout(() => {
      setFeedback('idle');
      nextFlag();
    }, correct ? 1600 : 2000);
  };

  const flag = FLAG_BY_ID[flagId];
  const symbol = flagId ? getSymbolLabel(flagId) : 'estrellas';

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg, #FFF9E6 0%, #F0EFFE 100%)' }}>
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
            fontSize: 'clamp(22px, 6vw, 32px)',
            color: '#2C2C4E',
            textAlign: 'center',
            lineHeight: 1.25,
          }}
        >
          ⭐ ¿Cuántas <span style={{ color: '#FF9F43' }}>{symbol}</span> tiene
          <br />
          la bandera de{' '}
          <span style={{ color: '#FF6B6B' }}>{flag?.nameES ?? '…'}</span>?
        </div>

        {/* Flag */}
        {flagId && (
          <div style={{ animation: 'flagPop 0.35s ease-out' }}>
            <FlagDisplay flagId={flagId} size="lg" />
          </div>
        )}

        {/* Hint counter — small dots to assist counting */}
        {flagId && !revealed && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 14, color: '#B0B0C8', fontWeight: 600 }}>
              Puedes contar:
            </span>
            {Array.from({ length: Math.min(flag?.numStars ?? 0, 6) }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#FF9F43',
                  animation: `dotPop 0.2s ${i * 0.07}s ease-out both`,
                }}
              />
            ))}
          </div>
        )}

        {/* Fun fact */}
        {revealed && flag && (
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
              border: '2px solid rgba(255,159,67,0.2)',
              animation: 'fadeUp 0.3s ease-out',
            }}
          >
            💡 {flag.funFact}
          </div>
        )}

        {/* Number pad */}
        <NumberPad
          min={0}
          max={getMaxAnswer(level)}
          onSelect={handleAnswer}
          disabled={revealed}
          correct={revealed && flag ? flag.numStars : null}
          selected={selected}
        />
      </div>

      <FeedbackOverlay
        show={feedback !== 'idle'}
        variant={feedback === 'correct' ? 'correct' : 'wrong'}
        message={feedback === 'correct' ? '¡Excelente!' : `Tiene ${flag?.numStars ?? ''}`}
      />

      <style>{`
        @keyframes flagPop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp  { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes dotPop  { from { transform: scale(0); } to { transform: scale(1); } }
      `}</style>
    </div>
  );
};
