import React from 'react';
import type { SessionStats } from '../types';

interface Props {
  stats: SessionStats;
  onBack: () => void;
}

export const GameHeader: React.FC<Props> = ({ stats, onBack }) => {
  const levelColors: Record<number, string> = {
    1: '#6BDB8F',
    2: '#FFE66D',
    3: '#FF6B6B',
  };

  const streakStars = Math.min(stats.currentStreak > 0 ? stats.currentStreak : 0, 5);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '2px solid rgba(108, 99, 255, 0.12)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: '2px solid #E8E8F0',
          borderRadius: 12,
          width: 44,
          height: 44,
          fontSize: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Nunito, sans-serif',
          transition: 'background 0.15s',
        }}
        aria-label="Volver"
      >
        ←
      </button>

      {/* Stars / streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: 22,
              filter: i < streakStars ? 'none' : 'grayscale(1)',
              opacity: i < streakStars ? 1 : 0.3,
              transition: 'all 0.2s',
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Score + level */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 18, color: '#2C2C4E' }}>
          {stats.correct}
          <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}> ✓</span>
        </span>
        <div
          style={{
            background: levelColors[stats.level],
            borderRadius: 10,
            padding: '4px 12px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: 13,
            color: '#fff',
            letterSpacing: '0.02em',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          Nv {stats.level}
        </div>
      </div>
    </div>
  );
};
