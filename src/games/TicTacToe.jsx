import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../utils/gameEngine';
import { Link } from 'react-router-dom';
import useConversation from '../utils/useConversation';

const TicTacToe = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    currentPlayer: 'O', // User is O and goes first
    winner: null,
    gameOver: false
  });
  const [isClaudeThinking, setIsClaudeThinking] = useState(false);
  const { requestTicTacToeMove } = useConversation();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cellSize = 100;
    const padding = 10;
    const boardSize = cellSize * 3 + padding * 4;

    // Set canvas size
    canvas.width = boardSize;
    canvas.height = boardSize;

    const drawBoard = () => {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;

      // Vertical lines
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cellSize * i + padding * i, padding);
        ctx.lineTo(cellSize * i + padding * i, canvas.height - padding);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(padding, cellSize * i + padding * i);
        ctx.lineTo(canvas.width - padding, cellSize * i + padding * i);
        ctx.stroke();
      }

      // Draw X's and O's
      gameState.board.forEach((cell, index) => {
        if (cell) {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const x = col * (cellSize + padding) + padding + cellSize / 2;
          const y = row * (cellSize + padding) + padding + cellSize / 2;

          if (cell === 'X') {
            // Draw X
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 4;
            const offset = cellSize / 3;
            ctx.beginPath();
            ctx.moveTo(x - offset, y - offset);
            ctx.lineTo(x + offset, y + offset);
            ctx.moveTo(x + offset, y - offset);
            ctx.lineTo(x - offset, y + offset);
            ctx.stroke();
          } else {
            // Draw O
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x, y, cellSize / 3, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      // Draw game over message
      if (gameState.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '32px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const message = gameState.winner
          ? `${gameState.winner} wins!`
          : "It's a draw!";
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
      }
    };

    const handleClick = async (e) => {
      if (gameState.gameOver || gameState.currentPlayer !== 'O') return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const col = Math.floor(x / (cellSize + padding));
      const row = Math.floor(y / (cellSize + padding));
      const index = row * 3 + col;

      if (index >= 0 && index < 9 && !gameState.board[index]) {
        // Make user's move
        const newBoard = [...gameState.board];
        newBoard[index] = 'O';

        const newGameState = {
          ...gameState,
          board: newBoard,
          currentPlayer: 'X'
        };

        setGameState(newGameState);

        // Check for win or draw
        if (checkWinner(newBoard) || newBoard.every(cell => cell)) {
          setGameState(prev => ({
            ...prev,
            gameOver: true,
            winner: checkWinner(newBoard)
          }));
          return;
        }

        // Claude's turn
        const boardState = newBoard.map(cell => cell || '-').join('');

        setIsClaudeThinking(true);
        try {
          const response = await requestTicTacToeMove(boardState);
          let claudeMove = parseInt(response.trim());

          const isValidMove = (!isNaN(claudeMove) && claudeMove >= 0 && claudeMove < 9 && !newBoard[claudeMove]);
          if (!isValidMove) {
            console.warn('Claude made an invalid move:', claudeMove);
            // Make Claude choose the first open move.
            claudeMove = boardState.indexOf('-');
          }

          newBoard[claudeMove] = 'X';

          const finalGameState = {
            ...newGameState,
            board: newBoard,
            currentPlayer: 'O'
          };

          setGameState(finalGameState);

          // Check for win or draw after Claude's move
          if (checkWinner(newBoard) || newBoard.every(cell => cell)) {
            setGameState(prev => ({
              ...prev,
              gameOver: true,
              winner: checkWinner(newBoard)
            }));
          }
        } catch (error) {
          console.error('Error getting Claude\'s move:', error);
        } finally {
          setIsClaudeThinking(false);
        }
      }
    };

    canvas.addEventListener('click', handleClick);

    // Create game engine
    const game = new GameEngine(canvas, {
      onRender: () => {
        drawBoard();
      }
    });

    game.start();

    return () => {
      game.stop();
      canvas.removeEventListener('click', handleClick);
    };
  }, [gameState, requestTicTacToeMove]);

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'O',
      winner: null,
      gameOver: false
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 max-w-full overflow-hidden">
      <Link to="/" className="mb-8 text-arcade-yellow hover:text-arcade-green transition-colors text-2xl">
        ← Back to Menu
      </Link>

      <h1 className="text-3xl font-bold mb-6 font-['Press_Start_2P'] max-w-full overflow-hidden text-center">Tic Tac Toe</h1>

      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          className="border-2 border-arcade-yellow"
        />
        <div className="h-8 mt-2 flex items-center justify-center">
          {isClaudeThinking && (
            <p className="text-arcade-green font-['Press_Start_2P'] text-[16px] animate-pulse">
              Claude is thinking...
            </p>
          )}
          {gameState.gameOver && (
            <button
              onClick={resetGame}
              className="mt-8 px-6 py-3 bg-arcade-yellow text-black font-['Press_Start_2P'] text-[16px] hover:bg-arcade-green transition-colors"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;