// src/games/SpaceExplorer/components/GameOverlay.jsx
const GameOverlay = ({ gameState, onRestart, onResume }) => {
  if (gameState.gameOver) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90">
        <h2 className="text-3xl font-bold mb-4 font-['Press_Start_2P'] text-blue-500">
          Game Over
        </h2>
        <p className="text-xl mb-4">Final Score: {gameState.score}</p>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-400 transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (gameState.paused) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75">
        <h2 className="text-3xl font-bold mb-4 font-['Press_Start_2P'] text-yellow-500">
          Paused
        </h2>
        <button
          onClick={onResume}
          className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Resume
        </button>
      </div>
    );
  }

  return null;
};

export { GameOverlay };