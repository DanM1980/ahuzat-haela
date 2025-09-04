import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const AboutSection = styled.section`
  padding: 5rem 0;
  background: white;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const TextContent = styled.div<{ isRTL: boolean }>`
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #2c5530;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
`;

const ListFeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #2c5530;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const AboutImage = styled.div`
  height: 400px;
  background: linear-gradient(45deg, #2c5530, #4a7c59);
  background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(44, 85, 48, 0.8), rgba(74, 124, 89, 0.8));
  }
`;


const About: React.FC = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'he';

  const features = [
    { icon: '🏠', text: language === 'he' ? 'צימרים מפנקים' : 'Luxurious Cottages' },
    { icon: '👨‍👩‍👧‍👦', text: language === 'he' ? 'מתאים למשפחות וקבוצות' : 'Perfect for Families & Groups' },
    { icon: '📍', text: language === 'he' ? 'מיקומים יפים' : 'Beautiful Locations' },
    { icon: '💎', text: language === 'he' ? 'איכות מעולה' : 'Excellent Quality' },
    { icon: '🔒', text: language === 'he' ? 'אמינות מלאה' : 'Complete Reliability' },
    { icon: '📞', text: language === 'he' ? 'זמינות 24/7' : '24/7 Availability' }
  ];


  return (
    <AboutSection id="about">
      <Container>
        <Content>
          <TextContent isRTL={isRTL}>
            <SectionTitle>{t('about.title')}</SectionTitle>
            <Description>{t('about.description')}</Description>
            
            <FeaturesList>
              {features.map((feature, index) => (
                <FeatureItem key={index}>
                  <ListFeatureIcon>{feature.icon}</ListFeatureIcon>
                  {feature.text}
                </FeatureItem>
              ))}
            </FeaturesList>
          </TextContent>
          
          <ImageContainer>
            <AboutImage />
          </ImageContainer>
        </Content>
        
      </Container>
    </AboutSection>
  );
};

export default About;
