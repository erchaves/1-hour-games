import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../utils/gameEngine';
import { Link } from 'react-router-dom';

const Breakout = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Game state
    const gameState = {
      paddle: {
        x: canvas.width / 2 - 50,
        y: canvas.height - 30,
        width: 100,
        height: 10,
        speed: 8
      },
      ball: {
        x: canvas.width / 2,
        y: canvas.height - 50,
        dx: 4,
        dy: -4,
        radius: 8,
        speed: 4,
        attached: true
      },
      bricks: [],
      brickInfo: {
        rowCount: 5,
        columnCount: 10,
        width: 70,
        height: 20,
        padding: 10,
        offsetTop: 60,
        offsetLeft: 35
      },
      score: 0,
      lives: 3,
      level: 1
    };

    // Controls
    let leftPressed = false;
    let rightPressed = false;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') leftPressed = true;
      if (e.key === 'ArrowRight') rightPressed = true;
      if (e.key === ' ' && gameState.ball.attached) {
        gameState.ball.attached = false;
        gameState.ball.dy = -gameState.ball.speed;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') leftPressed = false;
      if (e.key === 'ArrowRight') rightPressed = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Initialize bricks
    const initializeBricks = () => {
      gameState.bricks = [];
      for (let c = 0; c < gameState.brickInfo.columnCount; c++) {
        gameState.bricks[c] = [];
        for (let r = 0; r < gameState.brickInfo.rowCount; r++) {
          const brickType = Math.floor(r / 2); // Different types based on row
          gameState.bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1,
            type: brickType,
            points: (brickType + 1) * 10
          };
        }
      }
    };

    initializeBricks();

    // Game logic
    const updatePaddle = () => {
      if (leftPressed && gameState.paddle.x > 0) {
        gameState.paddle.x -= gameState.paddle.speed;
      }
      if (rightPressed && gameState.paddle.x < canvas.width - gameState.paddle.width) {
        gameState.paddle.x += gameState.paddle.speed;
      }

      // Move attached ball with paddle
      if (gameState.ball.attached) {
        gameState.ball.x = gameState.paddle.x + gameState.paddle.width / 2;
      }
    };

    const updateBall = () => {
      if (gameState.ball.attached) return;

      gameState.ball.x += gameState.ball.dx;
      gameState.ball.y += gameState.ball.dy;

      // Wall collision
      if (gameState.ball.x + gameState.ball.dx > canvas.width - gameState.ball.radius ||
          gameState.ball.x + gameState.ball.dx < gameState.ball.radius) {
        gameState.ball.dx = -gameState.ball.dx;
      }

      if (gameState.ball.y + gameState.ball.dy < gameState.ball.radius) {
        gameState.ball.dy = -gameState.ball.dy;
      }

      // Paddle collision
      if (gameState.ball.y + gameState.ball.radius > gameState.paddle.y &&
          gameState.ball.x > gameState.paddle.x &&
          gameState.ball.x < gameState.paddle.x + gameState.paddle.width) {

        // Calculate bounce angle based on where ball hits paddle
        const hitPos = (gameState.ball.x - gameState.paddle.x) / gameState.paddle.width;
        const angle = hitPos * Math.PI - Math.PI / 2;
        const speed = Math.sqrt(gameState.ball.dx * gameState.ball.dx + gameState.ball.dy * gameState.ball.dy);

        gameState.ball.dx = speed * Math.sin(angle);
        gameState.ball.dy = -speed * Math.cos(angle);
      }

      // Bottom collision (lose life)
      if (gameState.ball.y + gameState.ball.radius > canvas.height) {
        gameState.lives--;
        setLives(gameState.lives);

        if (gameState.lives <= 0) {
          setGameOver(true);
        } else {
          resetBall();
        }
      }
    };

    const checkBrickCollisions = () => {
      for (let c = 0; c < gameState.brickInfo.columnCount; c++) {
        for (let r = 0; r < gameState.brickInfo.rowCount; r++) {
          const brick = gameState.bricks[c][r];
          if (brick.status === 1) {
            const brickX = c * (gameState.brickInfo.width + gameState.brickInfo.padding) + gameState.brickInfo.offsetLeft;
            const brickY = r * (gameState.brickInfo.height + gameState.brickInfo.padding) + gameState.brickInfo.offsetTop;
            brick.x = brickX;
            brick.y = brickY;

            if (gameState.ball.x > brickX &&
                gameState.ball.x < brickX + gameState.brickInfo.width &&
                gameState.ball.y > brickY &&
                gameState.ball.y < brickY + gameState.brickInfo.height) {

              gameState.ball.dy = -gameState.ball.dy;
              brick.status = 0;
              gameState.score += brick.points;
              setScore(gameState.score);

              // Check if all bricks are destroyed
              if (checkWin()) {
                setWin(true);
                setGameOver(true);
              }
            }
          }
        }
      }
    };

    const checkWin = () => {
      for (let c = 0; c < gameState.brickInfo.columnCount; c++) {
        for (let r = 0; r < gameState.brickInfo.rowCount; r++) {
          if (gameState.bricks[c][r].status === 1) {
            return false;
          }
        }
      }
      return true;
    };

    const resetBall = () => {
      gameState.ball.x = gameState.paddle.x + gameState.paddle.width / 2;
      gameState.ball.y = canvas.height - 50;
      gameState.ball.dx = 4;
      gameState.ball.dy = -4;
      gameState.ball.attached = true;
    };

    // Rendering
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw paddle
      ctx.fillStyle = '#0ff';
      ctx.fillRect(gameState.paddle.x, gameState.paddle.y, gameState.paddle.width, gameState.paddle.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      // Draw bricks
      for (let c = 0; c < gameState.brickInfo.columnCount; c++) {
        for (let r = 0; r < gameState.brickInfo.rowCount; r++) {
          if (gameState.bricks[c][r].status === 1) {
            const brickX = c * (gameState.brickInfo.width + gameState.brickInfo.padding) + gameState.brickInfo.offsetLeft;
            const brickY = r * (gameState.brickInfo.height + gameState.brickInfo.padding) + gameState.brickInfo.offsetTop;

            // Different colors for different brick types
            const colors = ['#f00', '#fa0', '#ff0', '#0f0', '#00f'];
            ctx.fillStyle = colors[gameState.bricks[c][r].type];

            ctx.fillRect(brickX, brickY, gameState.brickInfo.width, gameState.brickInfo.height);
          }
        }
      }

      // Draw score
      ctx.font = '20px "Press Start 2P", monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText(`Score: ${gameState.score}`, 8, 24);

      // Draw lives
      ctx.fillText(`Lives: ${gameState.lives}`, canvas.width - 150, 24);
    };

    // Create game engine
    const game = new GameEngine(canvas, {
      onUpdate: (dt) => {
        if (!gameOver) {
          updatePaddle();
          updateBall();
          checkBrickCollisions();
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
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWin(false);
    setLevel(1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <Link to="/" className="mb-8 text-arcade-yellow hover:text-arcade-green transition-colors">
        ← Back to Menu
      </Link>

      <h1 className="text-4xl font-bold mb-4 font-['Press_Start_2P']">BREAKOUT</h1>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-blue-500 shadow-lg shadow-blue-500/50"
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90">
            <h2 className="text-3xl font-bold mb-4 font-['Press_Start_2P'] text-blue-500">
              {win ? 'You Win!' : 'Game Over'}
            </h2>
            <p className="text-xl mb-4">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-400 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm">
        <p className="mb-2">Use Arrow Left/Right to move</p>
        <p>Press Space to launch ball</p>
      </div>
    </div>
  );
};

export default Breakout;