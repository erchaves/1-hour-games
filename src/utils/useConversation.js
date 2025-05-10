// src/hooks/useConversation.js
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

// Get conversation from localStorage if available
const getStoredConversation = () => {
  try {
    const storedMessages = localStorage.getItem('claude_conversation');
    return storedMessages ? JSON.parse(storedMessages) : [];
  } catch (error) {
    console.error('Failed to load conversation from localStorage:', error);
    return [];
  }
};

export const useConversation = () => {
  const [messages, setMessages] = useState(getStoredConversation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('claude_conversation', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save conversation to localStorage:', error);
    }
  }, [messages]);

  // Format messages for Claude API
  const formatMessagesForApi = useCallback((messages) => {
    return messages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));
  }, []);

  // Send message to Claude API through our Express server
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

      // Create a new user message
      const userMessage = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        timestamp: new Date(),
      };

      // Add user message to state
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Format all messages for the API
        const formattedMessages = formatMessagesForApi([...messages, userMessage]);

        // Send to our Express server
        const response = await axios.post('/api/tictactoe', {
          messages: formattedMessages,
        });

        // Create a new assistant message from the response
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          text: response.data.text,
          sender: 'assistant',
          timestamp: new Date(),
        };

        // Add assistant message to state
        setMessages((prev) => [...prev, assistantMessage]);
        return assistantMessage;
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to get a response. Please try again.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, formatMessagesForApi]
  );

  // Send message to Claude API through our Express server
  const requestTicTacToeMove = useCallback(
    async (text) => {
      if (!text.trim()) return;

      // Create a new user message
      const userMessage = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        timestamp: new Date(),
      };

      setIsLoading(true);
      try {
        // Format all messages for the API
        const formattedMessages = formatMessagesForApi([userMessage]);

        // Send to our Express server
        const response = await axios.post('/api/tictactoe', {
          messages: formattedMessages,
        });

        const responseText = response.data.text;

        return responseText;
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to get a response. Please try again.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [formatMessagesForApi]
  );

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    localStorage.removeItem('claude_conversation');
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    requestTicTacToeMove,
    clearConversation,
  };
};

export default useConversation;
