import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GameEngine, collision } from '../utils/gameEngine';

const Snake = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake-highscore') || '0');
  });

  useEffect(() => {
    if (!canvasRef.current || !gameStarted) return;

    const game = new GameEngine(canvasRef.current, {
      width: 600,
      height: 600,
      fps: 10
    });

    // Snake game state
    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 1, y: 0 };
    let food = { x: 15, y: 10 };
    const gridSize = 20;
    const tileCount = 30;

    // Generate random food position
    const generateFood = () => {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
      // Make sure food doesn't spawn on snake
      if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
      }
    };

    // Handle input
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) direction = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.y === 0) direction = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.x === 0) direction = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.x === 0) direction = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    game.onUpdate = (dt) => {
      // Move snake
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
      };

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= tileCount ||
          newHead.y < 0 || newHead.y >= tileCount) {
        game.endGame();
        return;
      }

      // Check self collision
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        game.endGame();
        return;
      }

      snake.unshift(newHead);

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        game.addScore(10);
        generateFood();
      } else {
        snake.pop();
      }
    };

    game.onRender = (ctx) => {
      // Draw grid
      ctx.strokeStyle = '#333';
      for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, game.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(game.width, i * gridSize);
        ctx.stroke();
      }

      // Draw snake
      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00FF9D' : '#00CC7D';
        ctx.fillRect(
          segment.x * gridSize + 1,
          segment.y * gridSize + 1,
          gridSize - 2,
          gridSize - 2
        );
      });

      // Draw food
      ctx.fillStyle = '#FF6B9D';
      ctx.fillRect(
        food.x * gridSize + 1,
        food.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2
      );
    };

    game.onGameOver = (finalScore) => {
      setScore(finalScore);
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('snake-highscore', finalScore.toString());
      }
      setGameStarted(false);
    };

    game.start();

    return () => {
      game.stop();
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Link to="/" className="mb-8 text-arcade-yellow hover:text-arcade-green transition-colors">
        ← Back to Menu
      </Link>

      <h1 className="text-4xl font-arcade mb-4">SNAKE</h1>

      <canvas
        ref={canvasRef}
        className="border-4 border-arcade-green mb-4"
        style={{ imageRendering: 'pixelated' }}
      />

      {!gameStarted && (
        <div className="text-center">
          <p className="mb-4">High Score: {highScore}</p>
          {score > 0 && <p className="mb-4">Your Score: {score}</p>}
          <button
            onClick={() => setGameStarted(true)}
            className="px-6 py-3 bg-arcade-green text-black font-arcade text-sm hover:bg-arcade-yellow transition-colors"
          >
            {score > 0 ? 'PLAY AGAIN' : 'START GAME'}
          </button>
          <p className="mt-4 text-sm">Use arrow keys to control the snake</p>
        </div>
      )}
    </div>
  );
};

export default Snake;