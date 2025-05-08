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
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.small};

  h1 {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const WelcomeMessage = styled.div`
  text-align: center;
  margin: auto;
  max-width: 600px;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.large};

  h2 {
    color: ${({ theme }) => theme.colors.primary};
    margin-top: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  margin-left: ${(props) => (props.$isUser ? 'auto' : '0')};
  margin-right: ${(props) => (props.$isUser ? '0' : 'auto')};
  background-color: ${(props) => (props.$isUser
    ? props.theme.colors.primary
    : props.theme.colors.primaryLight)};
`;

const MessageText = styled.p`
  margin: 0;
  color: ${(props) => (props.$isUser
    ? props.theme.colors.white
    : props.theme.colors.text)};
  line-height: 1.4;
  white-space: pre-wrap;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.errorLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const InputForm = styled.form`
  display: flex;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid #eee;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid #ccc;
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
  font-size: ${({ theme }) => theme.fontSizes.regular};
  resize: none;
  min-height: 24px;
  max-height: 120px;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SendButton = styled.button`
  background-color: ${(props) => props.disabled
    ? props.theme.colors.disabled
    : props.theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  margin-left: ${({ theme }) => theme.spacing.sm};
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
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
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.xxl};

  .dot {
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.borderRadius.round};
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