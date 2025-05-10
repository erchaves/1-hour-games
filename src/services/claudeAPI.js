// src/services/claudeAPI.js
import axios from 'axios';

// Create axios instance pointing to our proxy server instead
const claudeClient = axios.create({
  baseURL: '/api', // Using relative URL for deployment
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Important for CORS preflight
});

export const sendMessageToClaude = async (messages, maxTokens = 1000) => {
  try {
    const response = await claudeClient.post('/claude', {
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: maxTokens,
      messages: messages,
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
        content: userMessages[i],
      });
    }
    if (i < assistantMessages.length) {
      formattedMessages.push({
        role: 'assistant',
        content: assistantMessages[i],
      });
    }
  }
  return formattedMessages;
};

export default {
  sendMessageToClaude,
  formatConversation,
};
