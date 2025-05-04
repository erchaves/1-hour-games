// src/games/SpaceExplorer/SpaceExplorer.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SpaceGame } from './SpaceExplorer/engine/SpaceGame';
import { GameHUD } from './SpaceExplorer/components/GameHUD';
import { GameOverlay } from './SpaceExplorer/components/GameOverlay';

const SpaceExplorer = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [gameState, setGameState] = useState({
    score: 0,
    lives: 3,
    fuel: 100,
    shields: 100,
    gameOver: false,
    paused: false
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize game
    gameRef.current = new SpaceGame(canvasRef.current, {
      onStateUpdate: (newState) => {
        setGameState(prev => ({ ...prev, ...newState }));
      },
      onGameOver: (finalScore) => {
        setGameState(prev => ({ ...prev, gameOver: true, score: finalScore }));
      }
    });

    gameRef.current.start();

    return () => {
      if (gameRef.current) {
        gameRef.current.stop();
      }
    };
  }, []);

  const handleRestart = () => {
    setGameState({
      score: 0,
      lives: 3,
      fuel: 100,
      shields: 100,
      gameOver: false,
      paused: false
    });
    gameRef.current?.restart();
  };

  const handlePause = () => {
    const newPausedState = !gameState.paused;
    setGameState(prev => ({ ...prev, paused: newPausedState }));
    gameRef.current?.setPaused(newPausedState);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <Link to="/" className="mb-8 text-arcade-yellow hover:text-arcade-green transition-colors">
        ← Back to Menu
      </Link>

      <h1 className="text-4xl font-bold mb-4 font-['Press_Start_2P']">SPACE EXPLORER</h1>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-blue-500 shadow-lg shadow-blue-500/50"
        />

        <GameHUD gameState={gameState} />

        {(gameState.gameOver || gameState.paused) && (
          <GameOverlay
            gameState={gameState}
            onRestart={handleRestart}
            onResume={handlePause}
          />
        )}
      </div>

      <div className="mt-4 text-sm space-y-1">
        <p>Arrow Keys: Turn ship | Shift: Boost | Ctrl: Brake</p>
        <p>Space: Fire weapons | E: Use warp drive | Tab: Toggle map</p>
        <p>Collect crystals and explore planets | Avoid asteroids and enemies</p>
      </div>
    </div>
  );
};

export default SpaceExplorer;