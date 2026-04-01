import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

const COLORS = ['#FF6B6B', '#FFE66D', '#6BDB8F', '#4ECDC4', '#6C63FF', '#FF9F43', '#FF78AC'];

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 8 + Math.random() * 10,
    delay: Math.random() * 0.4,
    duration: 0.9 + Math.random() * 0.6,
  }));
}

interface Props {
  show: boolean;
  variant?: 'correct' | 'wrong' | 'levelup';
  message?: string;
}

export const FeedbackOverlay: React.FC<Props> = ({ show, variant = 'correct', message }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show && variant === 'correct') {
      setParticles(makeParticles(28));
    } else if (show && variant === 'levelup') {
      setParticles(makeParticles(50));
    } else {
      setParticles([]);
    }
  }, [show, variant]);

  if (!show) return null;

  const isCorrect  = variant === 'correct' || variant === 'levelup';
  const emoji      = variant === 'levelup' ? '🚀' : isCorrect ? '⭐' : '💪';
  const bg         = variant === 'levelup'
    ? 'linear-gradient(135deg, #6C63FF 0%, #3ECFCF 100%)'
    : isCorrect
    ? 'linear-gradient(135deg, #6BDB8F 0%, #4ECDC4 100%)'
    : 'linear-gradient(135deg, #FF9F43 0%, #FF6B6B 100%)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {/* Confetti particles */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}

      {/* Feedback badge */}
      <div
        style={{
          background: bg,
          borderRadius: 32,
          padding: '28px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
          animation: 'popIn 0.25s ease-out',
        }}
      >
        <div style={{ fontSize: 64, lineHeight: 1 }}>{emoji}</div>
        {message && (
          <div
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: 28,
              color: '#fff',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {message}
          </div>
        )}
      </div>

      <style>{`
        @keyframes confettiFall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
