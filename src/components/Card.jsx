// src/components/Card.jsx
import styled from 'styled-components';

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme, $elevated }) =>
    $elevated ? theme.shadows.medium : theme.shadows.small};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    ${({ $hoverable }) => $hoverable && `
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    `}
  }
`;