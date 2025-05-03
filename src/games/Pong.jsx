import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../utils/gameEngine';
import { Link } from 'react-router-dom';

const Pong = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Game state
    const gameState = {
      ball: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 5,
        dy: 3,
        radius: 8
      },
      paddle1: {
        x: 10,
        y: canvas.height / 2 - 50,
        width: 10,
        height: 100,
        dy: 0,
        speed: 6
      },
      paddle2: {
        x: canvas.width - 20,
        y: canvas.height / 2 - 50,
        width: 10,
        height: 100,
        dy: 0,
        speed: 6
      },
      score: { player1: 0, player2: 0 },
      winningScore: 10
    };

    // Controls
    const keys = {
      w: false,
      s: false,
      ArrowUp: false,
      ArrowDown: false
    };

    const handleKeyDown = (e) => {
      if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game logic
    const updatePaddles = () => {
      // Player 1 controls (W/S)
      if (keys.w) gameState.paddle1.dy = -gameState.paddle1.speed;
      else if (keys.s) gameState.paddle1.dy = gameState.paddle1.speed;
      else gameState.paddle1.dy = 0;

      // Player 2 controls (Arrow keys)
      if (keys.ArrowUp) gameState.paddle2.dy = -gameState.paddle2.speed;
      else if (keys.ArrowDown) gameState.paddle2.dy = gameState.paddle2.speed;
      else gameState.paddle2.dy = 0;

      // Update positions
      gameState.paddle1.y += gameState.paddle1.dy;
      gameState.paddle2.y += gameState.paddle2.dy;

      // Keep paddles in bounds
      gameState.paddle1.y = Math.max(0, Math.min(canvas.height - gameState.paddle1.height, gameState.paddle1.y));
      gameState.paddle2.y = Math.max(0, Math.min(canvas.height - gameState.paddle2.height, gameState.paddle2.y));
    };

    const updateBall = () => {
      gameState.ball.x += gameState.ball.dx;
      gameState.ball.y += gameState.ball.dy;

      // Top and bottom collision
      if (gameState.ball.y - gameState.ball.radius <= 0 ||
          gameState.ball.y + gameState.ball.radius >= canvas.height) {
        gameState.ball.dy *= -1;
      }

      // Paddle collision
      if (gameState.ball.x - gameState.ball.radius <= gameState.paddle1.x + gameState.paddle1.width &&
          gameState.ball.y >= gameState.paddle1.y &&
          gameState.ball.y <= gameState.paddle1.y + gameState.paddle1.height &&
          gameState.ball.dx < 0) {
        gameState.ball.dx *= -1.1; // Increase speed slightly
        // Add some randomness to bounce angle
        gameState.ball.dy += (Math.random() - 0.5) * 2;
      }

      if (gameState.ball.x + gameState.ball.radius >= gameState.paddle2.x &&
          gameState.ball.y >= gameState.paddle2.y &&
          gameState.ball.y <= gameState.paddle2.y + gameState.paddle2.height &&
          gameState.ball.dx > 0) {
        gameState.ball.dx *= -1.1; // Increase speed slightly
        // Add some randomness to bounce angle
        gameState.ball.dy += (Math.random() - 0.5) * 2;
      }

      // Score detection
      if (gameState.ball.x - gameState.ball.radius <= 0) {
        gameState.score.player2++;
        setScore({ ...gameState.score });
        resetBall();
      }

      if (gameState.ball.x + gameState.ball.radius >= canvas.width) {
        gameState.score.player1++;
        setScore({ ...gameState.score });
        resetBall();
      }

      // Check for win
      if (gameState.score.player1 >= gameState.winningScore) {
        setGameOver(true);
        setWinner('Player 1');
      } else if (gameState.score.player2 >= gameState.winningScore) {
        setGameOver(true);
        setWinner('Player 2');
      }
    };

    const resetBall = () => {
      gameState.ball.x = canvas.width / 2;
      gameState.ball.y = canvas.height / 2;
      gameState.ball.dx = Math.random() > 0.5 ? 5 : -5;
      gameState.ball.dy = (Math.random() - 0.5) * 6;
    };

    // Rendering
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw center line
      ctx.strokeStyle = '#fff';
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw paddles
      ctx.fillStyle = '#fff';
      ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.paddle1.width, gameState.paddle1.height);
      ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.paddle2.width, gameState.paddle2.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw score
      ctx.font = '48px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(gameState.score.player1, canvas.width / 4, 60);
      ctx.fillText(gameState.score.player2, (canvas.width * 3) / 4, 60);
    };

    // Create game engine
    const game = new GameEngine(canvas, {
      onUpdate: (dt) => {
        if (!gameOver) {
          updatePaddles();
          updateBall();
        }
      },
      onRender: () => {
        render();
      }
    });

    game.start();

    // Cleanup
    return () => {
      game.stop();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  const resetGame = () => {
    setScore({ player1: 0, player2: 0 });
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <Link to="/" className="mb-8 text-arcade-yellow hover:text-arcade-green transition-colors">
        ← Back to Menu
      </Link>

      <h1 className="text-4xl font-bold mb-4 font-['Press_Start_2P']">PONG</h1>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-green-500 shadow-lg shadow-green-500/50"
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90">
            <h2 className="text-3xl font-bold mb-4 font-['Press_Start_2P'] text-green-500">
              {winner} Wins!
            </h2>
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
        <p className="mb-2">Player 1: W/S keys</p>
        <p>Player 2: Arrow Up/Down keys</p>
      </div>
    </div>
  );
};

export default Pong;