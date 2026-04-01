import React, { useEffect, useState } from 'react';

interface Props {
  onStart: () => void;
}

export const HomeScreen: React.FC<Props> = ({ onStart }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background: 'linear-gradient(160deg, #F0EFFE 0%, #E8F9F5 50%, #FFF9E6 100%)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* Globe illustration */}
      <div
        style={{
          fontSize: 110,
          lineHeight: 1,
          marginBottom: 8,
          animation: 'floatBob 3.5s ease-in-out infinite',
          filter: 'drop-shadow(0 12px 24px rgba(108,99,255,0.18))',
        }}
      >
        🌍
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(28px, 8vw, 48px)',
          color: '#2C2C4E',
          textAlign: 'center',
          margin: '16px 0 8px',
          lineHeight: 1.15,
        }}
      >
        El Explorador<br />de Banderas
      </h1>

      <p
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 20,
          color: '#6B6B8A',
          textAlign: 'center',
          margin: '0 0 40px',
          fontWeight: 600,
        }}
      >
        Aprende matemáticas con banderas del mundo 🗺️
      </p>

      {/* Floating flag emoji row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 44, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['🇯🇵', '🇫🇷', '🇧🇷', '🇨🇳', '🇪🇸', '🇩🇪'].map((flag, i) => (
          <div
            key={flag}
            style={{
              fontSize: 36,
              animation: `floatBob ${2.5 + i * 0.3}s ${i * 0.15}s ease-in-out infinite`,
            }}
          >
            {flag}
          </div>
        ))}
      </div>

      {/* CTA button */}
      <button
        onClick={onStart}
        style={{
          background: 'linear-gradient(135deg, #6C63FF 0%, #3ECFCF 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 24,
          padding: '22px 56px',
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 900,
          fontSize: 26,
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(108, 99, 255, 0.5)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(108, 99, 255, 0.4)';
        }}
      >
        ¡Jugar! 🚀
      </button>

      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 14, color: '#B0B0C8', marginTop: 20, textAlign: 'center' }}>
        4 mini-juegos · Matemáticas y geografía · Para exploradores curiosos
      </p>

      <style>{`
        @keyframes floatBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};
