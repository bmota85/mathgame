import type { Flag } from '../types';

// ── Flag registry ─────────────────────────────────────────────────────────────
// numColors = distinct colors visible (simplified, coat of arms omitted)
// numStars  = stars / prominent symbols (circles, crosses count as 1)
// funFact   = curiosity hook, short Spanish sentence for the parent to read aloud

export const FLAGS: Flag[] = [
  {
    id: 'jp',
    nameES: 'Japón',
    emoji: '🇯🇵',
    numColors: 2,
    numStars: 1,
    continent: 'Asia',
    funFact: '¡El círculo rojo representa el sol naciente!',
  },
  {
    id: 'ch',
    nameES: 'Suiza',
    emoji: '🇨🇭',
    numColors: 2,
    numStars: 1,
    continent: 'Europa',
    funFact: '¡Suiza es famosa por el chocolate y el queso!',
  },
  {
    id: 'se',
    nameES: 'Suecia',
    emoji: '🇸🇪',
    numColors: 2,
    numStars: 1,
    continent: 'Europa',
    funFact: '¡En Suecia en verano ¡el sol no se pone nunca!',
  },
  {
    id: 'fr',
    nameES: 'Francia',
    emoji: '🇫🇷',
    numColors: 3,
    numStars: 0,
    continent: 'Europa',
    funFact: '¡La Torre Eiffel mide 330 metros!',
  },
  {
    id: 'de',
    nameES: 'Alemania',
    emoji: '🇩🇪',
    numColors: 3,
    numStars: 0,
    continent: 'Europa',
    funFact: '¡En Alemania inventaron el coche!',
  },
  {
    id: 'it',
    nameES: 'Italia',
    emoji: '🇮🇹',
    numColors: 3,
    numStars: 0,
    continent: 'Europa',
    funFact: '¡La pizza y los espaguetis son italianos!',
  },
  {
    id: 'nl',
    nameES: 'Países Bajos',
    emoji: '🇳🇱',
    numColors: 3,
    numStars: 0,
    continent: 'Europa',
    funFact: '¡Hay más bicicletas que personas en Holanda!',
  },
  {
    id: 'no',
    nameES: 'Noruega',
    emoji: '🇳🇴',
    numColors: 3,
    numStars: 1,
    continent: 'Europa',
    funFact: '¡En Noruega puedes ver la Aurora Boreal!',
  },
  {
    id: 'es',
    nameES: 'España',
    emoji: '🇪🇸',
    numColors: 2,
    numStars: 0,
    continent: 'Europa',
    funFact: '¡España es el país con más horas de sol de Europa!',
  },
  {
    id: 'cn',
    nameES: 'China',
    emoji: '🇨🇳',
    numColors: 2,
    numStars: 5,
    continent: 'Asia',
    funFact: '¡La Muralla China es tan larga que tardarías 18 meses en caminarla!',
  },
  {
    id: 'br',
    nameES: 'Brasil',
    emoji: '🇧🇷',
    numColors: 4,
    numStars: 4,
    continent: 'América',
    funFact: '¡El Amazonas es el río más grande del mundo y está en Brasil!',
  },
  {
    id: 'tr',
    nameES: 'Turquía',
    emoji: '🇹🇷',
    numColors: 2,
    numStars: 1,
    continent: 'Asia',
    funFact: '¡Turquía está entre Europa y Asia a la vez!',
  },
  {
    id: 'gr',
    nameES: 'Grecia',
    emoji: '🇬🇷',
    numColors: 2,
    numStars: 1,
    continent: 'Europa',
    funFact: '¡Los Juegos Olímpicos nacieron en Grecia hace 2800 años!',
  },
  {
    id: 'us',
    nameES: 'Estados Unidos',
    emoji: '🇺🇸',
    numColors: 3,
    numStars: 6,
    continent: 'América',
    funFact: '¡Las 50 estrellas representan los 50 estados del país!',
  },
  {
    id: 'pt',
    nameES: 'Portugal',
    emoji: '🇵🇹',
    numColors: 3,
    numStars: 0,
    continent: 'Europa',
    funFact: '¡Portugal fue el primer país en navegar alrededor del mundo!',
  },
];

// ── Indexed access ────────────────────────────────────────────────────────────
export const FLAG_BY_ID = Object.fromEntries(FLAGS.map(f => [f.id, f])) as Record<string, Flag>;

// ── Filtered subsets by game type ─────────────────────────────────────────────
export const FLAGS_FOR_COUNT_COLORS = FLAGS.filter(f => f.numColors >= 2 && f.numColors <= 4);
export const FLAGS_FOR_COUNT_STARS  = FLAGS.filter(f => f.numStars >= 1 && f.numStars <= 6);
export const FLAGS_FOR_COMPARE      = FLAGS;
export const FLAGS_FOR_ADDITION     = FLAGS.filter(f => f.numColors >= 2 && f.numColors <= 4);

// ── SVG flag spec ────────────────────────────────────────────────────────────
// All flags drawn at viewBox="0 0 300 200"

export interface FlagSvgSpec {
  viewBox: string;
  rects?: Array<{ x: number; y: number; w: number; h: number; fill: string }>;
  circles?: Array<{ cx: number; cy: number; r: number; fill: string }>;
  polygons?: Array<{ points: string; fill: string }>;
  paths?: Array<{ d: string; fill: string; stroke?: string; strokeWidth?: number }>;
  // Horizontal / vertical stripes helper
  hStripes?: string[];   // colors top→bottom
  vStripes?: string[];   // colors left→right
  stars?: Array<{ cx: number; cy: number; r: number; fill: string; size?: 'big' | 'small' }>;
  cross?: { x: number; y: number; w: number; h: number; fill: string; borderColor?: string; borderW?: number };
}

const FLAG_SVGS: Record<string, FlagSvgSpec> = {
  // ── Europe ──────────────────────────────────────────────────────────────────
  es: {
    viewBox: '0 0 300 200',
    hStripes: ['#c60b1e', '#c60b1e', '#f1bf00', '#f1bf00', '#c60b1e', '#c60b1e'],
  },
  fr: { viewBox: '0 0 300 200', vStripes: ['#002395', '#EDEDED', '#ED2939'] },
  de: { viewBox: '0 0 300 200', hStripes: ['#000000', '#DD0000', '#FFCE00'] },
  it: { viewBox: '0 0 300 200', vStripes: ['#009246', '#FFFFFF', '#CE2B37'] },
  nl: { viewBox: '0 0 300 200', hStripes: ['#AE1C28', '#FFFFFF', '#21468B'] },
  pt: {
    viewBox: '0 0 300 200',
    vStripes: ['#006600', '#006600', '#FF0000', '#FF0000', '#FF0000'],
    rects: [{ x: 0, y: 0, w: 100, h: 200, fill: '#006600' }],
  },
  se: {
    viewBox: '0 0 300 200',
    rects: [{ x: 0, y: 0, w: 300, h: 200, fill: '#006AA7' }],
    cross: { x: 80, y: 0, w: 40, h: 200, fill: '#FECC02' },
  },
  no: {
    viewBox: '0 0 300 200',
    rects: [{ x: 0, y: 0, w: 300, h: 200, fill: '#EF2B2D' }],
    cross: { x: 90, y: 0, w: 200, h: 200, fill: '#FFFFFF', borderColor: '#002868', borderW: 20 },
  },
  ch: {
    viewBox: '0 0 300 200',
    rects: [
      { x: 0, y: 0, w: 300, h: 200, fill: '#FF0000' },
      { x: 112, y: 50, w: 76, h: 100, fill: '#FFFFFF' },
      { x: 75, y: 87, w: 150, h: 26, fill: '#FFFFFF' },
    ],
  },
  gr: {
    viewBox: '0 0 300 200',
    // 9 horizontal stripes + blue canton with white cross
    hStripes: ['#0D5EAF','#FFFFFF','#0D5EAF','#FFFFFF','#0D5EAF','#FFFFFF','#0D5EAF','#FFFFFF','#0D5EAF'],
    rects: [{ x: 0, y: 0, w: 111, h: 111, fill: '#0D5EAF' }],
    cross: { x: 40, y: 0, w: 31, h: 111, fill: '#FFFFFF' },
  },

  // ── Asia ────────────────────────────────────────────────────────────────────
  jp: {
    viewBox: '0 0 300 200',
    rects: [{ x: 0, y: 0, w: 300, h: 200, fill: '#FFFFFF' }],
    circles: [{ cx: 150, cy: 100, r: 60, fill: '#BC002D' }],
  },
  cn: {
    viewBox: '0 0 300 200',
    rects: [{ x: 0, y: 0, w: 300, h: 200, fill: '#DE2910' }],
    stars: [
      { cx: 55,  cy: 50,  r: 30, fill: '#FFDE00', size: 'big' },
      { cx: 100, cy: 25,  r: 13, fill: '#FFDE00', size: 'small' },
      { cx: 120, cy: 50,  r: 13, fill: '#FFDE00', size: 'small' },
      { cx: 110, cy: 80,  r: 13, fill: '#FFDE00', size: 'small' },
      { cx: 88,  cy: 100, r: 13, fill: '#FFDE00', size: 'small' },
    ],
  },
  tr: {
    viewBox: '0 0 300 200',
    rects: [{ x: 0, y: 0, w: 300, h: 200, fill: '#E30A17' }],
    // crescent + star
    circles: [
      { cx: 118, cy: 100, r: 55, fill: '#FFFFFF' },
      { cx: 138, cy: 100, r: 44, fill: '#E30A17' },
    ],
    stars: [{ cx: 190, cy: 100, r: 22, fill: '#FFFFFF', size: 'small' }],
  },

  // ── Americas ─────────────────────────────────────────────────────────────────
  br: {
    viewBox: '0 0 300 200',
    rects: [{ x: 0, y: 0, w: 300, h: 200, fill: '#009C3B' }],
    // Yellow diamond
    polygons: [{ points: '150,15 285,100 150,185 15,100', fill: '#FEDF00' }],
    circles: [{ cx: 150, cy: 100, r: 55, fill: '#002776' }],
    // 4 simplified stars in the blue circle
    stars: [
      { cx: 120, cy: 85,  r: 11, fill: '#FFFFFF', size: 'small' },
      { cx: 155, cy: 75,  r: 11, fill: '#FFFFFF', size: 'small' },
      { cx: 180, cy: 100, r: 11, fill: '#FFFFFF', size: 'small' },
      { cx: 155, cy: 122, r: 11, fill: '#FFFFFF', size: 'small' },
    ],
  },
  us: {
    viewBox: '0 0 300 200',
    // 13 stripes
    hStripes: [
      '#B22234','#FFFFFF','#B22234','#FFFFFF','#B22234','#FFFFFF','#B22234',
      '#FFFFFF','#B22234','#FFFFFF','#B22234','#FFFFFF','#B22234'
    ],
    // Blue canton
    rects: [{ x: 0, y: 0, w: 120, h: 108, fill: '#3C3B6E' }],
    // 6 simplified stars (2 rows × 3) in the canton
    stars: [
      { cx: 20, cy: 22, r: 10, fill: '#FFFFFF', size: 'small' },
      { cx: 60, cy: 22, r: 10, fill: '#FFFFFF', size: 'small' },
      { cx: 100,cy: 22, r: 10, fill: '#FFFFFF', size: 'small' },
      { cx: 20, cy: 56, r: 10, fill: '#FFFFFF', size: 'small' },
      { cx: 60, cy: 56, r: 10, fill: '#FFFFFF', size: 'small' },
      { cx: 100,cy: 56, r: 10, fill: '#FFFFFF', size: 'small' },
      { cx: 20, cy: 90, r: 10, fill: '#FFFFFF', size: 'small' },
      { cx: 60, cy: 90, r: 10, fill: '#FFFFFF', size: 'small' },
      { cx: 100,cy: 90, r: 10, fill: '#FFFFFF', size: 'small' },
    ],
  },
};

export { FLAG_SVGS };

// ── Helper: pick N random flags from a list, avoiding repeats ─────────────────
export function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ── Anti-repeat queue ─────────────────────────────────────────────────────────
// Keeps the last N used IDs and avoids picking them again
const recentIds: string[] = [];
const AVOID_LAST = 8;

export function pickUnique<T extends { id: string }>(arr: T[], n: number): T[] {
  const available = arr.filter(f => !recentIds.includes(f.id));
  const pool = available.length >= n ? available : arr;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, n);
  picked.forEach(p => {
    recentIds.push(p.id);
    if (recentIds.length > AVOID_LAST) recentIds.shift();
  });
  return picked;
}
