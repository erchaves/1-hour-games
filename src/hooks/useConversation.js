// src/hooks/useConversation.js
import { useState, useCallback } from 'react';
import { sendMessageToClaude } from '../services/claudeAPI';

export const useConversation = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format messages for Claude API
  const formatMessagesForApi = useCallback((messages) => {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
  }, []);

  // Send message to Claude API
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Create a new user message
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Format all messages for the API
      const formattedMessages = formatMessagesForApi([...messages, userMessage]);

      // Send to Claude API
      const response = await sendMessageToClaude(formattedMessages);

      // Create a new assistant message from the response
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        text: response[0].text,
        sender: 'assistant',
        timestamp: new Date()
      };

      // Add assistant message to state
      setMessages(prev => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, formatMessagesForApi]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation
  };
};

export default useConversation;