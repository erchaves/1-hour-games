// src/components/Container.jsx
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: ${({ $narrow }) => $narrow ? '800px' : '1200px'};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;