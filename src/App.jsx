// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameMenu from './components/GameMenu';
import ThreeBody from './games/ThreeBody';
import Snake from './games/Snake';
import Pong from './games/Pong';
import Breakout from './games/Breakout';
import SpaceExplorer from './games/SpaceExplorer';

function App() {
  return (
    <Router basename="/1-hour-games">
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/games/3-body" element={<ThreeBody />} />
          <Route path="/games/snake" element={<Snake />} />
          <Route path="/games/pong" element={<Pong />} />
          <Route path="/games/breakout" element={<Breakout />} />
          <Route path="/games/space-explorer" element={<SpaceExplorer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;