import { useState, useCallback } from 'react';
import { HomeScreen }    from './components/HomeScreen';
import { GameSelector }  from './components/GameSelector';
import { ResultsScreen } from './components/ResultsScreen';
import { CountColors }   from './games/CountColors';
import { CountStars }    from './games/CountStars';
import { Compare }       from './games/Compare';
import { Addition }      from './games/Addition';
import { useAdaptive }   from './hooks/useAdaptive';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import type { Screen, GameId } from './types';

const ROUNDS_PER_SESSION = 12;

export default function App() {
  const [screen, setScreen]       = useState<Screen>('home');
  const [gameId, setGameId]       = useState<GameId>('countColors');
  const [_rounds, setRounds]      = useState(0);

  const { stats, justLeveled, recordCorrect, recordWrong, incrementGames, reset } = useAdaptive();

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goHome = useCallback(() => {
    setScreen('home');
    reset();
    setRounds(0);
  }, [reset]);

  const goSelect = useCallback(() => setScreen('gameSelect'), []);

  const startGame = useCallback((id: GameId) => {
    setGameId(id);
    setScreen('game');
    setRounds(0);
    reset();
  }, [reset]);

  const goResults = useCallback(() => setScreen('results'), []);

  // ── Round lifecycle ─────────────────────────────────────────────────────────
  const handleCorrect = useCallback(() => {
    recordCorrect();
    incrementGames();
    setRounds(r => {
      if (r + 1 >= ROUNDS_PER_SESSION) {
        setTimeout(goResults, 1800); // let feedback overlay show
        return r + 1;
      }
      return r + 1;
    });
  }, [recordCorrect, incrementGames, goResults]);

  const handleWrong = useCallback(() => {
    recordWrong();
    incrementGames();
    setRounds(r => {
      if (r + 1 >= ROUNDS_PER_SESSION) {
        setTimeout(goResults, 2200);
        return r + 1;
      }
      return r + 1;
    });
  }, [recordWrong, incrementGames, goResults]);

  const handleBack = useCallback(() => setScreen('gameSelect'), []);

  // ── Game renderer ───────────────────────────────────────────────────────────
  const renderGame = () => {
    const commonProps = {
      stats,
      level: stats.level,
      onCorrect: handleCorrect,
      onWrong:   handleWrong,
      onBack:    handleBack,
    };
    switch (gameId) {
      case 'countColors': return <CountColors {...commonProps} />;
      case 'countStars':  return <CountStars  {...commonProps} />;
      case 'compare':     return <Compare     {...commonProps} />;
      case 'addition':    return <Addition    {...commonProps} />;
    }
  };

  // ── Screen router ───────────────────────────────────────────────────────────
  return (
    <>
      {screen === 'home'       && <HomeScreen onStart={goSelect} />}
      {screen === 'gameSelect' && <GameSelector onSelect={startGame} onBack={goHome} />}
      {screen === 'game'       && renderGame()}
      {screen === 'results'    && (
        <ResultsScreen
          stats={stats}
          onPlayAgain={() => startGame(gameId)}
          onHome={goHome}
        />
      )}

      {/* Level-up overlay (fires from any game screen) */}
      {screen === 'game' && justLeveled === 'up' && (
        <FeedbackOverlay
          show
          variant="levelup"
          message={`¡Nivel ${stats.level}! 🚀`}
        />
      )}
    </>
  );
}
