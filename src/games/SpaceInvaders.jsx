import React from 'react';
import { Link } from 'react-router-dom';

const SpaceInvaders = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Link to="/" className="mb-8 text-arcade-yellow hover:text-arcade-green transition-colors">
        ← Back to Menu
      </Link>

      <h1 className="text-4xl font-arcade mb-4">SPACE INVADERS</h1>

      <div className="text-center">
        <p className="mb-4 font-arcade">COMING SOON</p>
        <p className="text-sm">This game is under development</p>
      </div>
    </div>
  );
};

export default SpaceInvaders;