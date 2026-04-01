import React, { useEffect, useState } from 'react';
import type { SessionStats } from '../types';

interface Props {
  stats: SessionStats;
  onPlayAgain: () => void;
  onHome: () => void;
}

const MESSAGES = [
  { minScore: 9,  emoji: '🏆', text: '¡Eres un genio explorador!', sub: 'Lo hiciste perfecto. ¡Increíble!' },
  { minScore: 7,  emoji: '🚀', text: '¡Estás a punto de despegar!', sub: 'Cada vez mejor. ¡Sigue así!' },
  { minScore: 5,  emoji: '⭐', text: '¡Lo estás haciendo muy bien!', sub: 'La práctica te hace cada vez más listo.' },
  { minScore: 0,  emoji: '💪', text: '¡Buen intento, explorador!', sub: 'La próxima vez lo harás aún mejor.' },
];

export const ResultsScreen: React.FC<Props> = ({ stats, onPlayAgain, onHome }) => {
  const [visible, setVisible] = useState(false);
  const total = stats.correct + stats.wrong;
  const pct   = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
  const msg   = MESSAGES.find(m => stats.correct >= m.minScore) ?? MESSAGES[MESSAGES.length - 1];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const levelLabel = ['', 'Explorador', 'Aventurero', 'Genio'][stats.level] ?? 'Explorador';
  const levelColor = ['', '#6BDB8F', '#FFE66D', '#FF9F43'][stats.level] ?? '#6BDB8F';

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: 'linear-gradient(160deg, #F0EFFE 0%, #E8F9F5 60%, #FFF9E6 100%)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* Trophy emoji */}
      <div
        style={{
          fontSize: 96,
          lineHeight: 1,
          marginBottom: 16,
          animation: 'bounce 0.6s 0.3s ease-out both',
        }}
      >
        {msg.emoji}
      </div>

      {/* Message */}
      <h2
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(24px, 6vw, 36px)',
          color: '#2C2C4E',
          textAlign: 'center',
          margin: '0 0 8px',
        }}
      >
        {msg.text}
      </h2>
      <p
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 18,
          color: '#6B6B8A',
          fontWeight: 600,
          textAlign: 'center',
          margin: '0 0 32px',
        }}
      >
        {msg.sub}
      </p>

      {/* Stats cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          width: '100%',
          maxWidth: 380,
          marginBottom: 32,
        }}
      >
        {[
          { label: 'Correctas', value: stats.correct, color: '#6BDB8F' },
          { label: 'Precisión', value: `${pct}%`, color: '#6C63FF' },
          { label: 'Racha max.', value: stats.maxStreak, color: '#FF9F43' },
        ].map(card => (
          <div
            key={card.label}
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '16px 10px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
              border: `2px solid ${card.color}33`,
            }}
          >
            <div
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 30,
                color: card.color,
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: 13,
                color: '#B0B0C8',
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Level badge */}
      <div
        style={{
          background: levelColor,
          borderRadius: 16,
          padding: '10px 28px',
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 900,
          fontSize: 18,
          color: '#fff',
          textShadow: '0 1px 3px rgba(0,0,0,0.2)',
          marginBottom: 36,
          boxShadow: `0 6px 20px ${levelColor}66`,
        }}
      >
        Nivel {stats.level} · {levelLabel} 🌍
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onPlayAgain}
          style={{
            background: 'linear-gradient(135deg, #6C63FF 0%, #3ECFCF 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 20,
            padding: '18px 36px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 900,
            fontSize: 20,
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(108,99,255,0.35)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
        >
          🔄 Otra vez
        </button>
        <button
          onClick={onHome}
          style={{
            background: 'white',
            color: '#6C63FF',
            border: '2.5px solid #6C63FF',
            borderRadius: 20,
            padding: '18px 36px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 900,
            fontSize: 20,
            cursor: 'pointer',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
        >
          🏠 Inicio
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); }
          80%  { transform: scale(0.92); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
