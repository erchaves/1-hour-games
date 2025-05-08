// src/App.jsx
import React from 'react';
import { ThemeProvider } from 'styled-components';
import AppRouter from './AppRouter';
import { theme, GlobalStyle } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
