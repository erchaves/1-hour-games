// src/styles/theme.js
import { createGlobalStyle } from 'styled-components';

// Define theme constants to be used across the app
export const theme = {
  colors: {
    primary: '#6750A4',
    primaryDark: '#5D4599',
    primaryLight: '#E6E0E9',
    background: '#F5F5F5',
    text: '#1D1B20',
    textSecondary: '#49454F',
    error: '#e53935',
    errorLight: '#ffebee',
    disabled: '#C4C4C4',
    white: '#FFFFFF',
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  fontSizes: {
    small: '0.875rem',
    regular: '1rem',
    medium: '1.2rem',
    large: '1.4rem',
    xlarge: '1.8rem',
    xxlarge: '2rem',
    xxxlarge: '2.5rem',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xl: '18px',
    xxl: '24px',
    round: '50%',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1200px',
  },
  // Helper function for media queries
  media: {
    mobile: `@media (max-width: 480px)`,
    tablet: `@media (min-width: 481px) and (max-width: 768px)`,
    laptop: `@media (min-width: 769px) and (max-width: 1024px)`,
    desktop: `@media (min-width: 1025px)`,
    notMobile: `@media (min-width: 481px)`,
    notDesktop: `@media (max-width: 1024px)`,
  },
};

// Global styles
export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${(props) => props.theme.fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
  }

  p {
    line-height: 1.5;
  }

  button {
    font-family: ${(props) => props.theme.fonts.body};
  }

  /* Add responsive typography */
  html {
    font-size: 16px;

    ${(props) => props.theme.media.mobile} {
      font-size: 14px;
    }

    ${(props) => props.theme.media.desktop} {
      font-size: 18px;
    }
  }
`;

export default theme;
