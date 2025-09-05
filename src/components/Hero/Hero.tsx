import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const HeroBackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const HeroBackground = styled.div<{ imageUrl: string; isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.6);
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity 2s ease-in-out;
`;

const HeroContent = styled.div<{ isRTL: boolean }>`
  text-align: center;
  color: white;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CTAButton = styled.button`
  background: white;
  color: #2c5530;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  opacity: 0.7;
  animation: bounce 2s infinite;
  z-index: 2;
  cursor: pointer;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }
`;

const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'he';

  // Array of background images
  const backgroundImages = [
    '/hero/DJI_0011_10.jpg',
    '/hero/DJI_0011_13.jpg',
    '/hero/GX010233_stabilized.mp4_snapshot_00.44.705~2.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Change the image immediately when transition starts
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 2000); // Match transition duration
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextImageIndex = (currentImageIndex + 1) % backgroundImages.length;

  return (
    <HeroSection id="hero">
      <HeroBackgroundContainer>
        <HeroBackground 
          key={`current-${currentImageIndex}`}
          imageUrl={backgroundImages[currentImageIndex]}
          isActive={!isTransitioning}
        />
        <HeroBackground 
          key={`next-${nextImageIndex}`}
          imageUrl={backgroundImages[nextImageIndex]}
          isActive={isTransitioning}
        />
      </HeroBackgroundContainer>
      <HeroContent isRTL={isRTL}>
        <HeroTitle>{t('hero.title')}</HeroTitle>
        <HeroSubtitle>{t('hero.subtitle')}</HeroSubtitle>
        <CTAButton onClick={scrollToNext}>
          {t('hero.cta')}
        </CTAButton>
      </HeroContent>
      <ScrollIndicator onClick={scrollToNext}>
        ↓
      </ScrollIndicator>
    </HeroSection>
  );
};

export default Hero;
