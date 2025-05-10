# 1-Hour Games - Arcade Collection

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ferchaves%2F1-hour-games)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/erchaves/1-hour-games)

A collection of classic arcade games built with React and Tailwind CSS. Each game is designed to be built in about an hour!

## 🎮 Features

- Multiple classic arcade games
- Shared game engine and utilities
- Retro pixel-art styling with Tailwind CSS
- High score tracking (localStorage)
- Responsive design

## 🚀 Quick Start

### Open in StackBlitz

Click the button above to instantly run this project in your browser with StackBlitz!

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/erchaves/1-hour-games.git
cd 1-hour-games
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

4. Start the development server:
```bash
npm start
```

This will start both the frontend (Vite) and backend (Express) servers concurrently. The Vite server is configured to proxy API requests to the Express server during development.

## 📁 Project Structure

```
1-hour-games/
├── src/
│   ├── components/     # Shared UI components
│   ├── games/         # Individual game components
│   ├── utils/         # Game engine and utilities
│   ├── App.jsx
│   └── main.jsx
├── server/
│   └── index.js
├── public/
└── ...
```

## 🎯 Available Games

1. **3-Body Game** - TODO describe
2. **Snake** - Classic snake game with grid-based movement
3. **Pong** - Two-player paddle game (coming soon)
4. **Breakout** - Break all the bricks with your paddle (coming soon)

## 🛠️ Technologies Used

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Build Tool**: Vite
- **State Management**: Zustand
- **Routing**: React Router
- **Backend**: Express
- **AI**: Claude API

## 🎨 Shared Modules

The project uses several shared modules to maintain consistency across games:

### Game Engine (`utils/gameEngine.js`)
- Core game loop with fixed time step
- Input handling
- Score and lives management
- Collision detection utilities
- Particle systems
- Sprite animation

## 🎮 Adding New Games

To add a new arcade game:

1. Create a new component in `src/games/`
2. Use the shared GameEngine class
3. Add the game to the menu in `GameMenu.jsx`
4. Update routes in `App.jsx`

Example structure for a new game:

```jsx
import { GameEngine } from '../utils/gameEngine';

const MyNewGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const game = new GameEngine(canvasRef.current, {
      onUpdate: (dt) => {
        // Game logic here
      },
      onRender: (ctx) => {
        // Rendering code here
      }
    });

    game.start();
    return () => game.stop();
  }, []);

  return <canvas ref={canvasRef} />;
};
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**Ready to play? [Open in StackBlitz](https://stackblitz.com/github/erchaves/1-hour-games) and start gaming!** 🎮

## Deployment to Vercel

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to Vercel:
```bash
vercel
```

4. Set up environment variables in the Vercel dashboard:
   - Go to your project settings
   - Add the following environment variables:
     - `ANTHROPIC_API_KEY`: Your Anthropic API key

The project is configured to work with Vercel's serverless functions:
- The frontend is built as a static site
- The Express server runs as a serverless function
- API routes (/api/*) are automatically directed to the server
- No base path prefix is needed in the URL