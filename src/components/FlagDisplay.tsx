import React from 'react';
import { FLAG_SVGS } from '../data/flags';

// ── 5-pointed star path helper ────────────────────────────────────────────────
function starPath(cx: number, cy: number, outerR: number): string {
  const innerR = outerR * 0.38;
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return `M${points.join('L')}Z`;
}

interface Props {
  flagId: string;
  size?: 'sm' | 'md' | 'lg';
  /** Highlight border when selected */
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP = { sm: 120, md: 180, lg: 260 };

export const FlagDisplay: React.FC<Props> = ({
  flagId,
  size = 'md',
  selected = false,
  className = '',
  onClick,
}) => {
  const spec = FLAG_SVGS[flagId];
  const w = SIZE_MAP[size];
  const h = Math.round(w * (2 / 3));

  if (!spec) {
    return (
      <div
        style={{
          width: w,
          height: h,
          background: '#eee',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
        }}
      >
        🏳️
      </div>
    );
  }

  // ── Horizontal stripes ──────────────────────────────────────────────────────
  const hStripeEls: React.ReactNode[] = [];
  if (spec.hStripes) {
    const stripeH = 200 / spec.hStripes.length;
    spec.hStripes.forEach((fill, i) => {
      hStripeEls.push(
        <rect key={`hs${i}`} x={0} y={i * stripeH} width={300} height={stripeH} fill={fill} />,
      );
    });
  }

  // ── Vertical stripes ────────────────────────────────────────────────────────
  const vStripeEls: React.ReactNode[] = [];
  if (spec.vStripes) {
    const stripeW = 300 / spec.vStripes.length;
    spec.vStripes.forEach((fill, i) => {
      vStripeEls.push(
        <rect key={`vs${i}`} x={i * stripeW} y={0} width={stripeW} height={200} fill={fill} />,
      );
    });
  }

  // ── Cross ───────────────────────────────────────────────────────────────────
  const crossEls: React.ReactNode[] = [];
  if (spec.cross) {
    const c = spec.cross;
    if (c.borderColor && c.borderW) {
      crossEls.push(
        <rect key="cross-border-v" x={c.x - c.borderW / 2} y={c.y} width={c.borderW} height={c.h} fill={c.borderColor} />,
        <rect key="cross-border-h" x={0} y={c.y + c.h / 2 - c.borderW / 2} width={300} height={c.borderW} fill={c.borderColor} />,
      );
    }
    crossEls.push(
      <rect key="cross-v" x={c.x} y={c.y} width={c.w} height={c.h} fill={c.fill} />,
    );
    // Horizontal bar of cross (use the rect height / 3)
    const barH = Math.round(c.w * 0.7);
    const barY = c.y + (c.h - barH) / 2;
    crossEls.push(
      <rect key="cross-h" x={0} y={barY} width={300} height={barH} fill={c.fill} />,
    );
  }

  // ── Plain rects ─────────────────────────────────────────────────────────────
  const rectEls = (spec.rects ?? []).map((r, i) => (
    <rect key={`r${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
  ));

  // ── Polygons ─────────────────────────────────────────────────────────────────
  const polyEls = (spec.polygons ?? []).map((p, i) => (
    <polygon key={`p${i}`} points={p.points} fill={p.fill} />
  ));

  // ── Circles ──────────────────────────────────────────────────────────────────
  const circleEls = (spec.circles ?? []).map((c, i) => (
    <circle key={`c${i}`} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} />
  ));

  // ── Stars ────────────────────────────────────────────────────────────────────
  const starEls = (spec.stars ?? []).map((s, i) => (
    <path key={`s${i}`} d={starPath(s.cx, s.cy, s.r)} fill={s.fill} />
  ));

  // ── Paths ────────────────────────────────────────────────────────────────────
  const pathEls = (spec.paths ?? []).map((p, i) => (
    <path
      key={`pth${i}`}
      d={p.d}
      fill={p.fill}
      stroke={p.stroke}
      strokeWidth={p.strokeWidth}
    />
  ));

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-block',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 12,
        overflow: 'hidden',
        border: selected ? '4px solid #6C63FF' : '3px solid rgba(0,0,0,0.12)',
        boxShadow: selected
          ? '0 0 0 6px rgba(108, 99, 255, 0.25)'
          : '0 4px 16px rgba(0,0,0,0.15)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        transform: selected ? 'scale(1.04)' : 'scale(1)',
        width: w,
        height: h,
      }}
      className={className}
    >
      <svg
        viewBox={spec.viewBox}
        width={w}
        height={h}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {hStripeEls}
        {vStripeEls}
        {crossEls}
        {rectEls}
        {polyEls}
        {circleEls}
        {starEls}
        {pathEls}
      </svg>
    </div>
  );
};
