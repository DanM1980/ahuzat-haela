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
  transform: translate3d(0, ${props => props.scrollY * 0.5}px, 0);
  will-change: transform;
  backface-visibility: hidden;
  z-index: 1;
`;

const HeroContent = styled.div<{ isRTL: boolean }>`
  text-align: center;
  color: white;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
  margin-top: 2rem;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const HeroLogoSection = styled.div<{ scrollY: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 0;
  text-align: center;
  margin-left: 1rem;
  opacity: ${props => props.scrollY > 50 ? 0 : 1};
  visibility: ${props => props.scrollY > 50 ? 'hidden' : 'visible'};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
    margin-left: 0;
  }
`;

const HeroSiteName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -2rem;
`;

const HeroLogoImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
  
  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-family: "Playfair Display", "Heebo", serif !important;
  
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
  font-family: "Playfair Display", "Heebo", serif !important;
  
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
  font-family: "Playfair Display", "Heebo", serif !important;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CTAButton = styled.button`
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
  font-family: "Playfair Display", "Heebo", serif !important;
  
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
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const scrollToNext = () => {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroSection id="hero">
      <HeroBackgroundContainer>
        <HeroBackground imageUrl={selectedImage} scrollY={scrollY} />
      </HeroBackgroundContainer>
      <HeroContent isRTL={isRTL}>
        <HeroLogoSection scrollY={scrollY}>
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
