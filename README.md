# 🌍 El Explorador de Banderas

Juego educativo de matemáticas con banderas del mundo para niños de 4–6 años con altas capacidades.

## Base pedagógica

| Principio | Implementación |
|-----------|---------------|
| **Vygotsky ZPD** | 3 niveles adaptativos — sube tras 3 aciertos seguidos, baja tras 2 errores |
| **Piaget (preoperacional gifted)** | Empezamos en lo concreto (contar) → comparar → sumar |
| **NAGC** | Sesiones cortas de 12 rondas, feedback inmediato positivo |
| **Motivación intrínseca** | Banderas reales, datos curiosos, sin penalización dura |

## Juegos incluidos

1. 🎨 **¿Cuántos colores?** — Contar colores de una bandera
2. ⭐ **Cuenta las estrellas** — Identificar símbolos y contarlos
3. 🔍 **¿Cuál tiene más?** — Comparar dos banderas (mayor/menor)
4. ➕ **Suma mágica** — Sumar los colores de dos banderas

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar en desarrollo
npm run dev
# → http://localhost:5173

# 3. Build de producción
npm run build

# 4. Preview del build
npm run preview
```

## Deploy en Vercel

### Opción A — Vercel CLI (más rápido)

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Deploy (desde la raíz del proyecto)
vercel

# Seguir el wizard:
# - Set up and deploy? → Y
# - Which scope? → tu cuenta
# - Link to existing project? → N (primera vez)
# - Project name → flag-math-game (o el que quieras)
# - In which directory? → ./ (enter)
# - Want to override settings? → N

# Vercel detecta Vite automáticamente:
# Build command: npm run build
# Output dir: dist
# Install command: npm install
```

### Opción B — GitHub + Vercel (recomendado para updates futuros)

```bash
# 1. Crear repo en GitHub
git init
git add .
git commit -m "feat: initial flag math game"
git remote add origin https://github.com/TU_USUARIO/flag-math-game.git
git push -u origin main

# 2. En vercel.com → "Add New Project" → Import desde GitHub
# 3. Vercel detecta Vite solo → Deploy
# 4. Cada git push → redeploy automático
```

## Estructura del proyecto

```
src/
├── data/
│   └── flags.ts          # 15 banderas con SVG specs y metadatos
├── types/
│   └── index.ts          # TypeScript interfaces
├── hooks/
│   ├── useAdaptive.ts    # Dificultad adaptativa (Vygotsky ZPD)
│   └── useSound.ts       # Web Audio API — sin archivos externos
├── components/
│   ├── FlagDisplay.tsx   # Renderer SVG de banderas
│   ├── NumberPad.tsx     # Teclado numérico táctil
│   ├── FeedbackOverlay.tsx  # Confetti + badge de feedback
│   ├── GameHeader.tsx    # Cabecera con racha y nivel
│   ├── HomeScreen.tsx    # Pantalla de inicio
│   ├── GameSelector.tsx  # Selector de mini-juego
│   └── ResultsScreen.tsx # Resultados de sesión
├── games/
│   ├── CountColors.tsx   # Mini-juego 1
│   ├── CountStars.tsx    # Mini-juego 2
│   ├── Compare.tsx       # Mini-juego 3
│   └── Addition.tsx      # Mini-juego 4
├── App.tsx               # Orquestador principal
├── main.tsx
└── index.css
```

## Señales diagnósticas que puedes observar

Mientras tu hijo juega, observa:

- **Velocidad de respuesta**: ¿responde rápido sin necesitar los dots de ayuda?
- **Anticipación de nivel**: ¿pide el juego de suma antes de que lo proponga el juego?
- **Generalización**: ¿transfiere lo aprendido en un juego al siguiente?
- **Tolerancia al error**: ¿se frustra o lo reintenta con calma?
- **Curiosidad geográfica**: ¿pregunta sobre el país después del fun fact?
- **Autorregulación**: ¿para solo cuando se cansa, o podría seguir indefinidamente?

## Ampliar el juego

### Añadir más banderas

En `src/data/flags.ts`, añade un objeto al array `FLAGS` y un spec en `FLAG_SVGS`:

```typescript
// En FLAGS array:
{
  id: 'at',
  nameES: 'Austria',
  emoji: '🇦🇹',
  numColors: 2,
  numStars: 0,
  continent: 'Europa',
  funFact: '¡Mozart nació en Austria!',
},

// En FLAG_SVGS object:
at: {
  viewBox: '0 0 300 200',
  hStripes: ['#ED2939', '#FFFFFF', '#ED2939'],
},
```

### Añadir un nuevo mini-juego

1. Crea `src/games/TuJuego.tsx` siguiendo el patrón de `CountColors.tsx`
2. Importa y añade al `switch` en `App.tsx`
3. Añade la card en `GameSelector.tsx`

## Tecnologías

- **React 18** + **TypeScript** — tipo-seguro y moderno
- **Vite** — build ultrarrápido
- **Web Audio API** — sonidos sin archivos externos
- **CSS animations** — confetti y transiciones puras
- **SVG** — banderas dibujadas a mano, escalables y sin dependencias

---

Hecho con ❤️ para exploradores curiosos de 4 años y medio 🌍
