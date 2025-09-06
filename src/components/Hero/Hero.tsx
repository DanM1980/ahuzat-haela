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

const HeroBackground = styled.div<{ imageUrl: string; scrollY: number }>`
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
  transform: translateY(${props => props.scrollY * 0.5}px);
  will-change: transform;
  z-index: 1;
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
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-family: "Heebo", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.8rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.6;
  color: #FFD700;
  font-family: "Heebo", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.4rem;
  font-weight: 400;
  margin-bottom: 2.5rem;
  opacity: 0.8;
  line-height: 1.6;
  color: #E0E0E0;
  font-family: "Heebo", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CTAButton = styled.button`
  background: white;
  color: #2c5530;
  border: none;
  padding: 1.2rem 2.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: "Heebo", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 1rem 2rem;
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

  // Select next image based on cookie
  const [selectedImage] = useState(() => {
    // Get last image index from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const lastImageIndex = getCookie('lastHeroImage');
    let nextIndex = 0;
    
    if (lastImageIndex !== null && lastImageIndex !== undefined) {
      nextIndex = (parseInt(lastImageIndex) + 1) % backgroundImages.length;
    }

    // Save new index to cookie
    document.cookie = `lastHeroImage=${nextIndex}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year

    return backgroundImages[nextIndex];
  });

  // Parallax scroll effect
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroSection id="hero">
      <HeroBackgroundContainer>
        <HeroBackground imageUrl={selectedImage} scrollY={scrollY} />
      </HeroBackgroundContainer>
      <HeroContent isRTL={isRTL}>
        <HeroTitle>{t('hero.title')}</HeroTitle>
        <HeroSubtitle>{t('hero.subtitle')}</HeroSubtitle>
        <HeroDescription>{t('hero.description')}</HeroDescription>
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
