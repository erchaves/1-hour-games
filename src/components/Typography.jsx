// src/components/Typography.jsx
import styled from 'styled-components';

export const Heading1 = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxlarge};
  font-weight: bold;
  color: ${({ theme, $color }) =>
    $color === 'primary'
      ? theme.colors.primary
      : $color === 'light'
        ? theme.colors.white
        : theme.colors.text};
  margin: ${({ $noMargin }) => $noMargin ? '0' : '0 0 1rem 0'};
  line-height: 1.2;
`;

export const Heading2 = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: bold;
  color: ${({ theme, $color }) =>
    $color === 'primary'
      ? theme.colors.primary
      : $color === 'light'
        ? theme.colors.white
        : theme.colors.text};
  margin: ${({ $noMargin }) => $noMargin ? '0' : '0 0 0.8rem 0'};
  line-height: 1.3;
`;

export const Heading3 = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: bold;
  color: ${({ theme, $color }) =>
    $color === 'primary'
      ? theme.colors.primary
      : $color === 'light'
        ? theme.colors.white
        : theme.colors.text};
  margin: ${({ $noMargin }) => $noMargin ? '0' : '0 0 0.6rem 0'};
  line-height: 1.4;
`;

export const Paragraph = styled.p`
  font-size: ${({ theme, $size }) =>
    $size === 'small'
      ? theme.fontSizes.small
      : $size === 'large'
        ? theme.fontSizes.medium
        : theme.fontSizes.regular};
  color: ${({ theme, $color }) =>
    $color === 'secondary'
      ? theme.colors.textSecondary
      : $color === 'primary'
        ? theme.colors.primary
        : $color === 'light'
          ? theme.colors.white
          : theme.colors.text};
  line-height: 1.5;
  margin: ${({ $noMargin }) => $noMargin ? '0' : '0 0 1rem 0'};
`;