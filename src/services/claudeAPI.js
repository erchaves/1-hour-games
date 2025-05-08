// src/services/claudeAPI.js
import axios from 'axios';

// For production, you should use environment variables
// and potentially a backend proxy to secure your API key
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || 'YOUR_API_KEY';

// Create axios instance with default headers
const claudeClient = axios.create({
  baseURL: 'https://api.anthropic.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01'
  }
});

// In a production app, you would want to use a backend proxy
// to avoid exposing your API key in client-side code
export const sendMessageToClaude = async (messages, maxTokens = 1000) => {
  try {
    const response = await claudeClient.post('/messages', {
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: maxTokens,
      messages: messages
    });

    return response.data.content;
  } catch (error) {
    console.error('Error communicating with Claude API:', error);
    throw error;
  }
};

// Format conversations for Claude API
export const formatConversation = (userMessages, assistantMessages) => {
  const formattedMessages = [];

  // Interleave user and assistant messages
  for (let i = 0; i < Math.max(userMessages.length, assistantMessages.length); i++) {
    if (i < userMessages.length) {
      formattedMessages.push({
        role: 'user',
        content: userMessages[i]
      });
    }

    if (i < assistantMessages.length) {
      formattedMessages.push({
        role: 'assistant',
        content: assistantMessages[i]
      });
    }
  }

  return formattedMessages;
};

export default {
  sendMessageToClaude,
  formatConversation
};