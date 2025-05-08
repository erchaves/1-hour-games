// src/utils/media.js
import { css } from 'styled-components';
import { theme } from '../styles/theme';

// Media query functions for responsive design
export const media = {
  mobile: (...args) => css`
    @media (max-width: ${theme.breakpoints.mobile}) {
      ${css(...args)}
    }
  `,
  tablet: (...args) => css`
    @media (min-width: ${theme.breakpoints.mobile}) and (max-width: ${theme.breakpoints.tablet}) {
      ${css(...args)}
    }
  `,
  laptop: (...args) => css`
    @media (min-width: ${theme.breakpoints.tablet}) and (max-width: ${theme.breakpoints.laptop}) {
      ${css(...args)}
    }
  `,
  desktop: (...args) => css`
    @media (min-width: ${theme.breakpoints.laptop}) {
      ${css(...args)}
    }
  `,
  notMobile: (...args) => css`
    @media (min-width: ${theme.breakpoints.mobile}) {
      ${css(...args)}
    }
  `,
  notDesktop: (...args) => css`
    @media (max-width: ${theme.breakpoints.laptop}) {
      ${css(...args)}
    }
  `,
};

// Usage example:
// import { media } from '../utils/media';
// const ResponsiveComponent = styled.div`
//   font-size: 16px;
//
//   ${media.mobile`
//     font-size: 14px;
//   `}
//
//   ${media.desktop`
//     font-size: 18px;
//   `}
// `;

export default media;