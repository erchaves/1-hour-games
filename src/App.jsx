// src/App.jsx
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import AppRouter from './AppRouter';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
                 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
                 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F5F5F5;
    color: #1D1B20;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AppRouter />
    </>
  );
}

export default App;