// src/games/SpaceExplorer/components/GameHUD.jsx
const GameHUD = ({ gameState }) => {
  return (
    <div className="absolute top-4 left-4 right-4 pointer-events-none">
      <div className="flex justify-between text-white font-mono">
        <div className="space-y-2">
          <div>Score: {gameState.score}</div>
          <div>Lives: {gameState.lives}</div>
        </div>
        <div className="space-y-2 text-right">
          <div className="flex items-center justify-end gap-2">
            <span>Fuel:</span>
            <div className="w-32 h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${gameState.fuel}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span>Shields:</span>
            <div className="w-32 h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${gameState.shields}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GameHUD };