import React from 'react';
import type { GameId } from '../types';

const GAMES: Array<{
  id: GameId;
  emoji: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
}> = [
  {
    id: 'countColors',
    emoji: '🎨',
    title: '¿Cuántos colores?',
    desc: 'Cuenta los colores de cada bandera',
    color: '#6C63FF',
    bg: 'linear-gradient(135deg, #EDE9FF 0%, #D8F4FF 100%)',
  },
  {
    id: 'countStars',
    emoji: '⭐',
    title: 'Cuenta las estrellas',
    desc: 'Encuentra las estrellas y símbolos',
    color: '#FF9F43',
    bg: 'linear-gradient(135deg, #FFF3DE 0%, #FFE6E6 100%)',
  },
  {
    id: 'compare',
    emoji: '🔍',
    title: '¿Cuál tiene más?',
    desc: 'Compara dos banderas y elige',
    color: '#4ECDC4',
    bg: 'linear-gradient(135deg, #E0FFF8 0%, #E8F9FF 100%)',
  },
  {
    id: 'addition',
    emoji: '➕',
    title: 'Suma mágica',
    desc: 'Suma los colores de dos banderas',
    color: '#FF6B6B',
    bg: 'linear-gradient(135deg, #FFE8E8 0%, #FFF3E0 100%)',
  },
];

interface Props {
  onSelect: (id: GameId) => void;
  onBack: () => void;
}

export const GameSelector: React.FC<Props> = ({ onSelect, onBack }) => {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #F0EFFE 0%, #E8F9F5 50%, #FFF9E6 100%)',
        padding: '0 0 40px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'white',
            border: '2px solid #E8E8F0',
            borderRadius: 12,
            width: 44,
            height: 44,
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Nunito, sans-serif',
          }}
        >
          ←
        </button>
        <h2
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 900,
            fontSize: 24,
            color: '#2C2C4E',
            margin: 0,
          }}
        >
          Elige un juego 🎮
        </h2>
      </div>

      {/* Game cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          padding: '10px 20px',
          maxWidth: 700,
          margin: '0 auto',
        }}
      >
        {GAMES.map(g => (
          <button
            key={g.id}
            onClick={() => onSelect(g.id)}
            style={{
              background: g.bg,
              border: `2.5px solid ${g.color}22`,
              borderRadius: 24,
              padding: '28px 24px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px) scale(1.01)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 12px 32px ${g.color}33`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'none';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)';
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>{g.emoji}</div>
            <div
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 20,
                color: '#2C2C4E',
                marginBottom: 6,
              }}
            >
              {g.title}
            </div>
            <div
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: 15,
                color: '#6B6B8A',
                fontWeight: 600,
              }}
            >
              {g.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
