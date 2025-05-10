import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GameMenu = () => {
  const games = [
    {
      id: '3-body',
      title: '3 Body',
      description: `Resonate the 3-body Pendulum`,
      color: 'from-red-600 to-yellow-600',
      icon: '📍'
    },
    {
      id: 'space-explorer',
      title: 'Space Explorer',
      description: `Navigate through space`,
      color: 'from-indigo-600 to-purple-600',
      icon: '🚀'
    },
    {
      id: 'tictactoe',
      title: 'Tic Tac Toe',
      description: `Play Tic Tac Toe against AI`,
      color: 'from-indigo-600 to-purple-600',
      icon: '#️'
    },
    {
      id: 'snake',
      title: 'Snake',
      description: 'Eat food and avoid poison',
      color: 'from-green-600 to-emerald-600',
      icon: '🐍'
    },
    {
      id: 'pong',
      title: 'Pong',
      description: `Classic Pong Game`,
      color: 'from-blue-600 to-cyan-600',
      icon: '🏓'
    },
    {
      id: 'breakout',
      title: 'Breakout',
      description: `Break all the bricks`,
      color: 'from-orange-600 to-red-600',
      icon: '🧱'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <h1 className="text-7xl font-arcade mb-4">Vibe-Code Arcade</h1>
        <p className="text-2xl font-arcade text-arcade-yellow">MINI GAMES VIBE-CODED IN 1 HOUR.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-6"
      >
        <p className="font-arcade text-xl animate-blink">FREE PLAY</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/games/${game.id}`}>
              <div className={`p-6 rounded-lg bg-gradient-to-br ${game.color} hover:scale-105 transform transition-all cursor-pointer`}>
                <div className="text-6xl mb-4 text-center">{game.icon}</div>
                <h2 className="text-2xl font-arcade mb-2 text-center">{game.title}</h2>
                <p className="text-lg text-center opacity-80">{game.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;