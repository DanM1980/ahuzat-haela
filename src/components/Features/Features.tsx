import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import { Star, MapPin, Wifi, TreePine } from 'lucide-react';

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2<{ isRTL: boolean }>`
  text-align: center;
  font-size: 2.5rem;
  color: rgb(41 37 36 / 1);
  margin-bottom: 3rem;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FeatureCard = styled.div<{ isRTL: boolean }>`
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FFD700, #FF8C00);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  
  svg {
    width: 3rem;
    height: 3rem;
  }
`;

const FeatureTitle = styled.h3<{ isRTL: boolean }>`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.8rem;
  font-weight: 600;
  line-height: 1.3;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
`;

const FeatureDescription = styled.p<{ isRTL: boolean }>`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
`;

const Features: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'he';

  const featureCards = React.useMemo(() => [
    {
      icon: <TreePine />,
      title: language === 'he' ? 'חוויה כפרית אותנטית' : 'Authentic Countryside Charm',
      description: language === 'he' ? 'רומנטיקה, יוקרה ופסטורליות' : 'A blend of romance, elegance, and pastoral serenity.'
    },
    {
      icon: <Wifi />,
      title: language === 'he' ? 'מתקנים מהשורה הראשונה' : 'Top-Notch Facilities',
      description: language === 'he' ? 'בריכה מחוממת וסאונה, ג\'קוזי בכל חדר' : 'Heated pool, dry sauna, and private jacuzzi in every suite.'
    },
    {
      icon: <MapPin />,
      title: language === 'he' ? 'מיקום מעולה' : 'Prime Location',
      description: language === 'he' ? '15 דקות מחופי הכנרת ובלב הגולן' : 'Just 15 minutes from the shores of the Sea of Galilee, in the heart of the Golan Heights.'
    },
    {
      icon: <Star />,
      title: language === 'he' ? 'ארבע יחידות אירוח יוקרתיות' : 'Exclusive Luxury Suites',
      description: language === 'he' ? 'יחידות אירוח כפריות משולבות עץ ואבן' : 'Rustic yet refined, designed with natural wood and stone.'
    }
  ], [language]);

  return (
    <FeaturesSection>
      <Container>
        <SectionTitle isRTL={isRTL}>
          {language === 'he' ? 'למה לבחור באחוזת האלה?' : 'Why choose Ella Estate?'}
        </SectionTitle>
        
        <FeaturesContainer>
          {featureCards.map((card, index) => (
            <FeatureCard key={index} isRTL={isRTL}>
              <FeatureIcon>{card.icon}</FeatureIcon>
              <FeatureTitle isRTL={isRTL}>{card.title}</FeatureTitle>
              <FeatureDescription isRTL={isRTL}>{card.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesContainer>
      </Container>
    </FeaturesSection>
  );
};

export default Features;
