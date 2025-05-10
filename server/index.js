import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Claude API endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    res.json({
      text: response.content[0].text,
    });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: 'Failed to get response from Claude' });
  }
});

// Claude API proxy - explicitly defined path
app.post('/api/tictactoe', async (req, res) => {
  try {
    const { messages } = req.body;
    const boardConfig = messages[0].content;

    console.log(boardConfig);

    const systemPrompt = [
      `You are playing TicTacToe as X against a human player (O). Follow these strategic rules in order:`,
      `1. Always take the center if it's available`,
      `2. If the opponent has two in a row, block them`,
      `3. If you can win in one move, take that move`,
      `4. If the opponent has a corner, take the opposite corner`,
      `5. Take any available corner`,
      `6. Take any available edge`,
      ``,
      `The current board state is (from top-left to bottom-right): ` + boardConfig,
      `Each position is represented by its index (0-8) where:`,
      `0 1 2`,
      `3 4 5`,
      `6 7 8`,
      ``,
      `Respond ONLY with the number of the position you want to move to (0-8). No other text.`
    ].join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 10,
      temperature: .1,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    res.json({
      text: response.content[0].text,
    });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: 'Failed to get response from Claude' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});