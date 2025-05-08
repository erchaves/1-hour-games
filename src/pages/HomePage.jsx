// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomePage = () => {
  return (
    <HomeContainer>
      <Header>
        <h1>Welcome to Claude AI</h1>
      </Header>

      <HeroSection>
        <h2>Your Intelligent Assistant</h2>
        <p>Powered by Claude 3.7 Sonnet, one of the most advanced AI assistants.</p>
      </HeroSection>

      <FeaturesSection>
        <h3>What can Claude do?</h3>

        <FeatureGrid>
          <FeatureCard>
            <FeatureTitle>Answer Questions</FeatureTitle>
            <FeatureDescription>
              Get detailed answers on a wide range of topics, from science and history to practical advice.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Creative Writing</FeatureTitle>
            <FeatureDescription>
              Generate stories, poems, scripts, and other creative content tailored to your needs.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Problem Solving</FeatureTitle>
            <FeatureDescription>
              Get help with coding, mathematics, analytical thinking, and complex problems.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Research Assistant</FeatureTitle>
            <FeatureDescription>
              Summarize information, explore topics in depth, and get help analyzing concepts.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>

      <CTASection>
        <StartButton to="/chat">Start Chatting</StartButton>
      </CTASection>
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.large} ${({ theme }) => theme.borderRadius.large};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};

  h1 {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.xxxlarge};
  }
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxxl};

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xxlarge};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.medium};
    color: ${({ theme }) => theme.colors.textSecondary};
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.5;
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxxl};

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    text-align: center;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const FeatureTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0;
`;

const CTASection = styled.section`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxxl};
`;

const StartButton = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: bold;
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default HomePage;