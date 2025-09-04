import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2<{ isRTL: boolean }>`
  text-align: center;
  font-size: 2.5rem;
  color: #2c5530;
  margin-bottom: 3rem;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div<{ isRTL: boolean }>`
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(44, 85, 48, 0.1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(44, 85, 48, 0.15);
    border-color: rgba(44, 85, 48, 0.2);
  }
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #2c5530, #4a7c59);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
  box-shadow: 0 4px 15px rgba(44, 85, 48, 0.3);
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  color: #2c5530;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.3;
`;

const FeatureDescription = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
`;

const Features: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'he';

  const featureCards = [
    {
      icon: '🌲',
      title: language === 'he' ? 'חוויה כפרית אותנטית' : 'Authentic Rural Experience',
      description: language === 'he' ? 'רומנטיקה, יוקרה ופסטורליות' : 'Romance, luxury and pastoralism'
    },
    {
      icon: '🏊‍♂️',
      title: language === 'he' ? 'מתקנים מהשורה הראשונה' : 'First-class Facilities',
      description: language === 'he' ? 'בריכה מחוממת, סאונה וג\'קוזי בכל חדר' : 'Heated pool, sauna and jacuzzi in every room'
    },
    {
      icon: '📍',
      title: language === 'he' ? 'מיקום מעולה' : 'Excellent Location',
      description: language === 'he' ? '15 דקות מחופי הכנרת ובלב הגולן' : '15 minutes from the Sea of Galilee beaches and in the heart of the Golan'
    },
    {
      icon: '🏡',
      title: language === 'he' ? '4 סוויטות יוקרה' : '4 Luxury Suites',
      description: language === 'he' ? 'סוויטות כפריות משולבות עץ ואבן' : 'Rural suites combining wood and stone'
    }
  ];

  return (
    <FeaturesSection>
      <Container>
        <SectionTitle isRTL={isRTL}>
          {language === 'he' ? 'למה לבחור באחוזת האלה?' : 'Why choose Ahuzat Ha\'Ela?'}
        </SectionTitle>
        
        <FeaturesContainer>
          {featureCards.map((card, index) => (
            <FeatureCard key={index} isRTL={isRTL}>
              <FeatureIcon>{card.icon}</FeatureIcon>
              <FeatureTitle>{card.title}</FeatureTitle>
              <FeatureDescription>{card.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesContainer>
      </Container>
    </FeaturesSection>
  );
};

export default Features;
