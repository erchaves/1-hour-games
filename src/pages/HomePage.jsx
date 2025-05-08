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
  padding: 0 20px;
`;

const Header = styled.header`
  background-color: #6750A4;
  color: white;
  padding: 30px;
  text-align: center;
  border-radius: 0 0 12px 12px;
  margin-bottom: 40px;

  h1 {
    margin: 0;
    font-size: 2.5rem;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 60px;

  h2 {
    font-size: 2rem;
    color: #1D1B20;
    margin-bottom: 16px;
  }

  p {
    font-size: 1.2rem;
    color: #49454F;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.5;
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 60px;

  h3 {
    font-size: 1.8rem;
    color: #1D1B20;
    margin-bottom: 30px;
    text-align: center;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureTitle = styled.h4`
  font-size: 1.4rem;
  color: #6750A4;
  margin-top: 0;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  color: #49454F;
  line-height: 1.5;
  margin: 0;
`;

const CTASection = styled.section`
  text-align: center;
  margin-bottom: 60px;
`;

const StartButton = styled(Link)`
  display: inline-block;
  background-color: #6750A4;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  padding: 16px 40px;
  border-radius: 30px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5D4599;
  }
`;

export default HomePage;