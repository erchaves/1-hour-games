// src/pages/ChatPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import useConversation from '../hooks/useConversation';

const ChatPage = () => {
  const { messages, isLoading, error, sendMessage } = useConversation();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '' || isLoading) return;

    await sendMessage(inputText);
    setInputText('');
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h1>Claude AI Assistant</h1>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 ? (
          <WelcomeMessage>
            <h2>Welcome to Claude AI</h2>
            <p>Ask me anything! I'm powered by Claude 3.7 Sonnet, one of the most advanced AI assistants.</p>
          </WelcomeMessage>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              $isUser={message.sender === 'user'}
            >
              <MessageText $isUser={message.sender === 'user'}>
                {message.text}
              </MessageText>
            </MessageBubble>
          ))
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputForm onSubmit={handleSendMessage}>
        <MessageInput
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <SendButton
          type="submit"
          disabled={inputText.trim() === '' || isLoading}
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </SendButton>
      </InputForm>

      {isLoading && (
        <LoadingIndicator>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </LoadingIndicator>
      )}
    </ChatContainer>
  );
};

// Styled Components
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const ChatHeader = styled.header`
  background-color: #6750A4;
  color: white;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  margin: auto;
  max-width: 600px;
  padding: 24px;
  background-color: #f5f5f5;
  border-radius: 12px;

  h2 {
    color: #6750A4;
    margin-top: 0;
  }

  p {
    color: #333;
    line-height: 1.5;
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  margin-left: ${(props) => (props.$isUser ? 'auto' : '0')};
  margin-right: ${(props) => (props.$isUser ? '0' : 'auto')};
  background-color: ${(props) => (props.$isUser ? '#6750A4' : '#E6E0E9')};
`;

const MessageText = styled.p`
  margin: 0;
  color: ${(props) => (props.$isUser ? 'white' : '#333')};
  line-height: 1.4;
  white-space: pre-wrap;
`;

const ErrorMessage = styled.div`
  color: #e53935;
  text-align: center;
  margin: 10px 0;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 8px;
`;

const InputForm = styled.form`
  display: flex;
  padding: 16px;
  background-color: white;
  border-top: 1px solid #eee;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 24px;
  font-size: 16px;
  resize: none;
  min-height: 24px;
  max-height: 120px;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: #6750A4;
  }
`;

const SendButton = styled.button`
  background-color: #6750A4;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 0 20px;
  margin-left: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #5D4599;
  }

  &:disabled {
    background-color: #C4C4C4;
    cursor: not-allowed;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 20px;

  .dot {
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    } 40% {
      transform: scale(1.0);
    }
  }
`;

export default ChatPage;