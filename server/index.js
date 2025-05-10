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

    const systemPrompt = `Considering a game board of tic-tac-toe.  It's your move, you're X.  The message describes the current game board where each character's index represents the spot on the board like this with these arrays stacked vertically: [0,1,2],[3,4,5],[6,7,8]. Please respond without any words. Respond only with the coordinate of the move using the index between 0 and 9 to represent the spot on the board. Desired format: Single number.  Example: "0" (top left corner) or "4" (middle square)`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 500,
      temperature: 1,
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