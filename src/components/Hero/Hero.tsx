import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollToSection } from '../../hooks/useScrollToSection';

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

const HeroBackground = styled.div<{ imageUrl: string }>`
  position: absolute;
  top: -20%;
  left: 0;
  right: 0;
  bottom: -20%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: brightness(0.6);
  z-index: 1;
`;

const HeroContent = styled.div<{ isRTL: boolean }>`
  text-align: center;
  color: white;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
  margin-top: 2rem;
  position: relative;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const HeroLogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  min-height: 200px;
  
  @media (max-width: 768px) {
    min-height: 150px;
  }
  
  @media (max-width: 480px) {
    min-height: 120px;
  }
`;

const HeroSiteName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroSiteNameHebrew = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  line-height: 1.2;
  font-family: "Inter", "Heebo", sans-serif !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  margin-bottom: 0.3rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSiteNameEnglish = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  line-height: 1.2;
  font-family: "Inter", "Heebo", sans-serif !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroLogoContainer = styled.div`
  position: absolute;
  top: 0;
  right: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;

  @media (max-width: 480px) {
    right: 1rem;
  }
`;

const HeroLogoImage = styled.img`
  width: 200px;
  height: 200px;
  margin: 0;
  object-fit: contain;
  filter: brightness(1.3) 
          contrast(1.4);
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
  
  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }
`;

const HeroSubtitle = styled.p<{ isRTL: boolean }>`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.6;
  color: #FFD700;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const HeroDescription = styled.p<{ isRTL: boolean }>`
  font-size: 1.4rem;
  font-weight: 400;
  margin-bottom: 2.5rem;
  opacity: 0.8;
  line-height: 1.6;
  color: #E0E0E0;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CTAButton = styled.button<{ isRTL: boolean }>`
  background: white;
  color: rgb(41 37 36 / 1);
  border: none;
  padding: 1.2rem 2.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  
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
  const { scrollToSection } = useScrollToSection();
  const isRTL = language === 'he';

  // Array of background images
  const backgroundImages = [
    '/images/hero/DJI_0011_10.jpg',
    '/images/hero/DJI_0011_13.jpg',
    '/images/hero/GX010233_stabilized.mp4_snapshot_00.44.705~2.jpg'
  ];

  // Select next image based on cookie
  const [selectedImage] = useState(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const lastImageIndex = getCookie('lastHeroImage');
    const nextIndex = lastImageIndex ? (parseInt(lastImageIndex) + 1) % backgroundImages.length : 0;

    // Save new index to cookie
    document.cookie = `lastHeroImage=${nextIndex}; path=/; max-age=${60 * 60 * 24 * 365}`;

    return backgroundImages[nextIndex];
  });

  const scrollToNext = () => {
    scrollToSection('gallery');
  };

  return (
    <HeroSection id="hero">
      <HeroBackgroundContainer>
        <HeroBackground imageUrl={selectedImage} />
      </HeroBackgroundContainer>
      <HeroContent isRTL={isRTL}>
        <HeroLogoSection>
          <HeroLogoContainer>
            <HeroLogoImage 
              src="/logo.png" 
              alt="אחוזת האלה - Ella Estate"
              onError={(e) => {
                // Fallback to logo-bw.png if logo.png fails
                e.currentTarget.src = "/logo-bw.png";
              }}
            />
          </HeroLogoContainer>
          <HeroSiteName>
            <HeroSiteNameHebrew>אחוזת האלה</HeroSiteNameHebrew>
            <HeroSiteNameEnglish>Ella Estate</HeroSiteNameEnglish>
          </HeroSiteName>
        </HeroLogoSection>
        <HeroSubtitle isRTL={isRTL}>{t('hero.subtitle')}</HeroSubtitle>
        <HeroDescription isRTL={isRTL}>{t('hero.description')}</HeroDescription>
        <CTAButton isRTL={isRTL} onClick={scrollToNext}>
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
