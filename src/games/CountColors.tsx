import React, { useState, useEffect, useCallback } from 'react';
import { FlagDisplay } from '../components/FlagImage';
import { NumberPad } from '../components/NumberPad';
import { FeedbackOverlay } from '../components/FeedbackOverlay';
import { GameHeader } from '../components/GameHeader';
import { FLAGS_FOR_COUNT_COLORS, FLAG_BY_ID, pickUnique as pickRandom } from '../data/flags';
import { useSound } from '../hooks/useSound';
import type { SessionStats, Level } from '../types';

interface Props {
  stats: SessionStats;
  level: Level;
  onCorrect: () => void;
  onWrong: () => void;
  onBack: () => void;
}

// Level-gated pools:
// Level 1 → 2 colors only
// Level 2 → 2–3 colors
// Level 3 → 2–4 colors

function getPool(level: Level) {
  if (level === 1) return FLAGS_FOR_COUNT_COLORS.filter(f => f.numColors === 2);
  if (level === 2) return FLAGS_FOR_COUNT_COLORS.filter(f => f.numColors <= 3);
  return FLAGS_FOR_COUNT_COLORS;
}

function getMaxAnswer(level: Level) {
  if (level === 1) return 4;
  if (level === 2) return 5;
  return 6;
}

export const CountColors: React.FC<Props> = ({ stats, level, onCorrect, onWrong, onBack }) => {
  const { playCorrect, playWrong } = useSound();
  const [flagId, setFlagId]       = useState('');
  const [selected, setSelected]   = useState<number | null>(null);
  const [feedback, setFeedback]   = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [revealed, setRevealed]   = useState(false);

  const nextFlag = useCallback(() => {
    const pool = getPool(level);
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
    const correct = flag.numColors === n;
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

    // Auto-advance after feedback
    setTimeout(() => {
      setFeedback('idle');
      nextFlag();
    }, correct ? 1600 : 2000);
  };

  const flag = FLAG_BY_ID[flagId];

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg, #F0EFFE 0%, #E8F9F5 100%)' }}>
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
          🎨 ¿Cuántos <span style={{ color: '#6C63FF' }}>colores</span> tiene la bandera de
          <br />
          <span style={{ color: '#FF6B6B' }}>{flag?.nameES ?? '…'}</span>?
        </div>

        {/* Flag */}
        {flagId && (
          <div style={{ animation: 'flagPop 0.35s ease-out' }}>
            <FlagDisplay flagId={flagId} size="lg" />
          </div>
        )}

        {/* Country fun fact — shown after answer */}
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
              border: '2px solid rgba(108,99,255,0.12)',
              animation: 'fadeUp 0.3s ease-out',
            }}
          >
            💡 {flag.funFact}
          </div>
        )}

        {/* Number buttons */}
        <NumberPad
          min={1}
          max={getMaxAnswer(level)}
          onSelect={handleAnswer}
          disabled={revealed}
          correct={revealed && flag ? flag.numColors : null}
          selected={selected}
        />
      </div>

      {/* Feedback overlay */}
      <FeedbackOverlay
        show={feedback !== 'idle'}
        variant={feedback === 'correct' ? 'correct' : 'wrong'}
        message={feedback === 'correct' ? '¡Muy bien!' : `Son ${flag?.numColors ?? ''} colores`}
      />

      <style>{`
        @keyframes flagPop {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
