import React, { useState } from 'react';

interface Props {
  flagId: string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZE_MAP = { sm: 120, md: 180, lg: 260 };

export const FlagImage: React.FC<Props> = ({
  flagId,
  size = 'md',
  selected = false,
  onClick,
}) => {
  const [errored, setErrored] = useState(false);
  const w = SIZE_MAP[size];
  const h = Math.round(w * (2 / 3));

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: w,
        height: h,
        borderRadius: 12,
        overflow: 'hidden',
        border: selected ? '4px solid #6C63FF' : '3px solid rgba(0,0,0,0.12)',
        boxShadow: selected
          ? '0 0 0 6px rgba(108,99,255,0.25), 0 6px 20px rgba(0,0,0,0.2)'
          : '0 4px 16px rgba(0,0,0,0.15)',
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.15s, box-shadow 0.15s, border 0.15s',
        cursor: onClick ? 'pointer' : 'default',
        background: '#f0f0f0',
        flexShrink: 0,
      }}
      aria-label={flagId}
    >
      {errored ? (
        <span style={{ fontSize: Math.round(w / 3) }}>🏳️</span>
      ) : (
        <img
          src={`https://flagcdn.com/w320/${flagId}.png`}
          width={w}
          height={h}
          onError={() => setErrored(true)}
          alt={`Bandera de ${flagId}`}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="eager"
        />
      )}
    </div>
  );
};

// Backward-compat alias so existing games don't need import changes
export { FlagImage as FlagDisplay };
