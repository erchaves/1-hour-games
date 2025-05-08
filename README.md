# Claude AI Web App

A React web application that uses the Claude API to deliver AI-generated content to users.

## Features

- Chat interface with Claude AI
- Seamless message sending and receiving
- Responsive design for all devices
- Loading indicators and error handling

## Prerequisites

- Node.js (v14 or higher)
- An Anthropic API key for Claude

## Setup Instructions

1. Clone this repository:
```bash
git clone https://github.com/yourusername/claude-web-app.git
cd claude-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Claude API key to the `.env` file:
```
VITE_CLAUDE_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Production Build

To create a production build:

```bash
npm run build
```

The build files will be in the `dist` directory and can be served using any static file server.

## Security Considerations

**Important**: This demo app directly communicates with the Claude API from the client side. For a production application, you should:

1. Create a backend service to handle API requests
2. Never expose your API key in client-side code
3. Implement proper authentication and rate limiting

## Project Structure

- `src/pages`: Main application pages (Home, Chat)
- `src/components`: Reusable UI components
- `src/services`: API integration services
- `src/hooks`: Custom React hooks
- `src/utils`: Utility functions

## Technologies Used

- React
- Vite
- React Router
- Styled Components
- Axios
- 