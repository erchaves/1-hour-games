// src/components/Button.jsx
import styled from 'styled-components/macro';

export const Button = styled.button`
  background-color: ${({ theme, $variant }) =>
    $variant === 'secondary'
      ? theme.colors.white
      : $variant === 'danger'
        ? theme.colors.error
        : theme.colors.primary};
  color: ${({ theme, $variant }) =>
    $variant === 'secondary'
      ? theme.colors.primary
      : theme.colors.white};
  border: 1px solid ${({ theme, $variant }) =>
    $variant === 'secondary'
      ? theme.colors.primary
      : $variant === 'danger'
        ? theme.colors.error
        : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
  padding: ${({ theme, $size }) =>
    $size === 'small'
      ? `${theme.spacing.xs} ${theme.spacing.md}`
      : $size === 'large'
        ? `${theme.spacing.md} ${theme.spacing.xl}`
        : `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme, $size }) =>
    $size === 'small'
      ? theme.fontSizes.small
      : $size === 'large'
        ? theme.fontSizes.medium
        : theme.fontSizes.regular};
  font-weight: bold;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    background-color: ${({ theme, $variant }) =>
      $variant === 'secondary'
        ? theme.colors.primaryLight
        : $variant === 'danger'
          ? '#d32f2f' // Darker red
          : theme.colors.primaryDark};
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}40`};
  }
`;