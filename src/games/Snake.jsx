import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../utils/gameEngine';
import { Link } from 'react-router-dom';

const Snake = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    // Game state
    const gameState = {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      bombs: [], // Array of bomb positions
      direction: { x: 1, y: 0 }, // Start moving right automatically
      nextDirection: { x: 1, y: 0 },
      score: 0,
      gameOver: false,
      moveTimer: 0,
      moveInterval: 100, // milliseconds between moves
    };

    // Generate random food position
    const generateFood = () => {
      gameState.food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };

      // Make sure food doesn't spawn on snake or bombs
      if (gameState.snake.some(segment =>
        segment.x === gameState.food.x && segment.y === gameState.food.y) ||
        gameState.bombs.some(bomb =>
        bomb.x === gameState.food.x && bomb.y === gameState.food.y)) {
        generateFood();
      }
    };

    // Generate bombs
    const generateBombs = () => {
      const numBombs = Math.floor(gameState.score / 50) + 3; // More bombs as score increases
      gameState.bombs = [];

      for (let i = 0; i < numBombs; i++) {
        let bomb = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };

        // Make sure bomb doesn't spawn on snake, food, or other bombs
        while (
          gameState.snake.some(segment => segment.x === bomb.x && segment.y === bomb.y) ||
          (gameState.food.x === bomb.x && gameState.food.y === bomb.y) ||
          gameState.bombs.some(b => b.x === bomb.x && b.y === bomb.y)
        ) {
          bomb = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
          };
        }

        gameState.bombs.push(bomb);
      }
    };

    // Initialize bombs
    generateBombs();

    // Handle keyboard input
    const handleKeyDown = (e) => {
      if (gameState.gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (gameState.direction.y === 0) {
            gameState.nextDirection = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
          if (gameState.direction.y === 0) {
            gameState.nextDirection = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
          if (gameState.direction.x === 0) {
            gameState.nextDirection = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
          if (gameState.direction.x === 0) {
            gameState.nextDirection = { x: 1, y: 0 };
          }
          break;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);

    // Game update function
    const update = (dt) => {
      if (gameState.gameOver) return;

      // Update move timer
      gameState.moveTimer += dt * 1000; // Convert to milliseconds

      if (gameState.moveTimer >= gameState.moveInterval) {
        gameState.moveTimer = 0;

        // Update direction
        gameState.direction = { ...gameState.nextDirection };

        // Only move if we have a direction
        if (gameState.direction.x !== 0 || gameState.direction.y !== 0) {
          // Calculate new head position
          const head = {
            x: gameState.snake[0].x + gameState.direction.x,
            y: gameState.snake[0].y + gameState.direction.y
          };

          // Check wall collision
          if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameState.gameOver = true;
            setGameOver(true);
            if (gameState.score > highScore) {
              setHighScore(gameState.score);
              localStorage.setItem('snake-highscore', gameState.score.toString());
            }
            return;
          }

          // Check self collision
          if (gameState.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameState.gameOver = true;
            setGameOver(true);
            if (gameState.score > highScore) {
              setHighScore(gameState.score);
              localStorage.setItem('snake-highscore', gameState.score.toString());
            }
            return;
          }

          // Check bomb collision
          if (gameState.bombs.some(bomb => bomb.x === head.x && bomb.y === head.y)) {
            gameState.gameOver = true;
            setGameOver(true);
            if (gameState.score > highScore) {
              setHighScore(gameState.score);
              localStorage.setItem('snake-highscore', gameState.score.toString());
            }
            return;
          }

          // Add new head
          gameState.snake.unshift(head);

          // Check food collision
          if (head.x === gameState.food.x && head.y === gameState.food.y) {
            gameState.score += 10;
            setScore(gameState.score);
            generateFood();
            // Speed up game slightly
            gameState.moveInterval = Math.max(50, gameState.moveInterval - 2);

            // Regenerate bombs every 50 points
            if (gameState.score % 50 === 0) {
              generateBombs();
            }
          } else {
            // Remove tail if no food eaten
            gameState.snake.pop();
          }
        }
      }
    };

    // Render function
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#333'; // Made brighter for better visibility
      ctx.lineWidth = 1;
      for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Draw snake
      gameState.snake.forEach((segment, index) => {
        // Gradient from bright green (head) to dark green (tail)
        const brightness = 1 - (index / gameState.snake.length) * 0.5;
        ctx.fillStyle = `rgb(0, ${Math.floor(255 * brightness)}, 0)`;

        ctx.fillRect(
          segment.x * gridSize + 1,
          segment.y * gridSize + 1,
          gridSize - 2,
          gridSize - 2
        );
      });

      // Draw food (apple emoji)
      ctx.font = `${gridSize - 4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        '🍎',
        gameState.food.x * gridSize + gridSize / 2,
        gameState.food.y * gridSize + gridSize / 2
      );

      // Draw bombs (poison emoji)
      gameState.bombs.forEach(bomb => {
        ctx.fillText(
          '☠️',
          bomb.x * gridSize + gridSize / 2,
          bomb.y * gridSize + gridSize / 2
        );
      });

      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = '20px "Press Start 2P", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`Score: ${gameState.score}`, 10, 10);
      ctx.fillText(`High: ${highScore}`, 10, 40);
    };

    // Create game engine
    const game = new GameEngine(canvas, {
      onUpdate: update,
      onRender: render
    });

    game.start();

    // Cleanup
    return () => {
      game.stop();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [highScore, gameOver]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <Link to="/" className="mb-8 text-arcade-yellow hover:text-arcade-green transition-colors">
        ← Back to Menu
      </Link>

      <h1 className="text-4xl font-bold mb-4 font-['Press_Start_2P']">SNAKE</h1>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="border-4 border-green-500 shadow-lg shadow-green-500/50"
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90">
            <h2 className="text-3xl font-bold mb-4 font-['Press_Start_2P'] text-green-500">
              Game Over
            </h2>
            <p className="text-xl mb-2">Score: {score}</p>
            <p className="text-xl mb-4">High Score: {highScore}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm">
        <p>Use arrow keys to control the snake</p>
        <p>Eat 🍎 apples to grow and score points</p>
        <p>Avoid ☠️ poison and walls!</p>
      </div>
    </div>
  );
};

export default Snake;