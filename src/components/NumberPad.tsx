import React from 'react';

interface Props {
  min?: number;
  max: number;
  onSelect: (n: number) => void;
  disabled?: boolean;
  correct?: number | null; // highlight correct after reveal
  selected?: number | null;
}

export const NumberPad: React.FC<Props> = ({
  min = 1,
  max,
  onSelect,
  disabled = false,
  correct = null,
  selected = null,
}) => {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 14,
        justifyContent: 'center',
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      {numbers.map(n => {
        const isCorrect  = correct !== null && n === correct;
        const isWrong    = correct !== null && n === selected && n !== correct;
        const isSelected = n === selected;

        let bg      = 'white';
        let border  = '3px solid #E8E8F0';
        let color   = '#2C2C4E';
        let shadow  = '0 4px 12px rgba(0,0,0,0.08)';
        let scale   = 1;

        if (isCorrect) {
          bg = '#6BDB8F'; border = '3px solid #4AB871'; color = '#fff'; shadow = '0 4px 16px rgba(107,219,143,0.5)';
        } else if (isWrong) {
          bg = '#FF6B6B'; border = '3px solid #E05555'; color = '#fff';
        } else if (isSelected) {
          bg = '#6C63FF'; border = '3px solid #5952E0'; color = '#fff'; scale = 1.06;
        }

        return (
          <button
            key={n}
            disabled={disabled}
            onClick={() => onSelect(n)}
            style={{
              width: 78,
              height: 78,
              borderRadius: 20,
              background: bg,
              border,
              color,
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: 32,
              cursor: disabled ? 'default' : 'pointer',
              boxShadow: shadow,
              transform: `scale(${scale})`,
              transition: 'transform 0.12s, background 0.15s, box-shadow 0.15s',
              opacity: disabled && !isCorrect && !isWrong ? 0.55 : 1,
            }}
            aria-label={`Número ${n}`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
};
