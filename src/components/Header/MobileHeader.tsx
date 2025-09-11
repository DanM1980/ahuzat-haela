import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollEffect } from '../../hooks/useScrollEffect';
import { useScrollToSection } from '../../hooks/useScrollToSection';

const HeaderContainer = styled.header<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.$isScrolled ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: ${props => props.$isScrolled ? 'blur(3px)' : 'blur(10px)'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: ${props => props.$isScrolled ? '0.3rem 0' : '1rem 0'};
  border: ${props => props.$isScrolled ? '1px solid rgba(44, 85, 48, 0.1)' : '2px solid rgba(44, 85, 48, 0.2)'};
  border-radius: ${props => props.$isScrolled ? '0 0 8px 8px' : '0 0 20px 20px'};
  box-shadow: ${props => props.$isScrolled ? '0 2px 10px rgba(44, 85, 48, 0.05)' : '0 4px 20px rgba(44, 85, 48, 0.1)'};
  width: 100%;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const LanguageSwitcher = styled.div`
  display: flex;
  align-items: center;
`;

const LanguageButton = styled.button<{ $isScrolled: boolean }>`
  background: transparent;
  color: #333;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: ${props => props.$isScrolled ? '0.9rem' : '1.3rem'};
  font-weight: 500;
  font-family: "Inter", "Heebo", sans-serif !important;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    color: rgb(41 37 36 / 1);
    transform: scale(1.05);
  }
`;

const GlobeIcon = styled.svg<{ $isScrolled: boolean }>`
  width: ${props => props.$isScrolled ? '1rem' : '1.2rem'};
  height: ${props => props.$isScrolled ? '1rem' : '1.2rem'};
  fill: rgb(41 37 36 / 1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const MobileMenuButton = styled.button<{ $isScrolled: boolean }>`
  background: none;
  border: none;
  font-size: ${props => props.$isScrolled ? '1.3rem' : '1.8rem'};
  cursor: pointer;
  color: #333;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SiteName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 3rem;
`;

const SiteNameHebrew = styled.div<{ $isScrolled: boolean }>`
  font-size: ${props => props.$isScrolled ? '0.9rem' : '1.3rem'};
  font-weight: bold;
  color: rgb(41 37 36 / 1);
  line-height: 1.2;
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SiteNameEnglish = styled.div<{ $isScrolled: boolean }>`
  font-size: ${props => props.$isScrolled ? '0.9rem' : '1.3rem'};
  font-weight: bold;
  color: rgb(41 37 36 / 1);
  line-height: 1.2;
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const LogoImage = styled.img<{ $isScrolled: boolean }>`
  width: ${props => props.$isScrolled ? '50px' : '80px'};
  height: ${props => props.$isScrolled ? '50px' : '80px'};
  object-fit: contain;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: -1rem;
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;
  border-radius: 0 0 10px 10px;
  z-index: 1001;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
`;

const MobileNavLink = styled.a<{ $isRTL: boolean }>`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.3rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    color: rgb(41 37 36 / 1);
    background: rgba(0, 0, 0, 0.05);
  }
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const MobileHeader: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const isScrolled = useScrollEffect(50);
  const { scrollToSection: baseScrollToSection, scrollToTop: baseScrollToTop } = useScrollToSection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    baseScrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    baseScrollToTop();
    setIsMobileMenuOpen(false);
  };

  const isRTL = language === 'he';

  return (
    <HeaderContainer $isScrolled={isScrolled}>
      <HeaderContent>
        {/* Left Section - Hamburger Menu */}
        <LeftSection>
          <MobileMenuButton
            $isScrolled={isScrolled}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </MobileMenuButton>
        </LeftSection>

        {/* Center Section - Logo and Site Name */}
        <CenterSection onClick={scrollToTop}>
          <LogoContainer>
            <SiteName>
              <SiteNameHebrew $isScrolled={isScrolled}>אחוזת האלה</SiteNameHebrew>
              <SiteNameEnglish $isScrolled={isScrolled}>Ella Estate</SiteNameEnglish>
            </SiteName>
            <LogoImage
              $isScrolled={isScrolled}
              src="/logo.png"
              alt="אחוזת האלה - Ella Estate"
              onError={(e) => {
                e.currentTarget.src = "/logo-bw.png";
              }}
            />
          </LogoContainer>
        </CenterSection>

        {/* Right Section - Language Switcher */}
        <RightSection>
          <LanguageSwitcher>
            <LanguageButton
              $isScrolled={isScrolled}
              onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
            >
              <GlobeIcon $isScrolled={isScrolled} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </GlobeIcon>
              {language === 'he' ? 'EN' : 'HE'}
            </LanguageButton>
          </LanguageSwitcher>
        </RightSection>

        {/* Mobile Menu */}
        <MobileMenu $isOpen={isMobileMenuOpen}>
          <MobileNavLink
            $isRTL={isRTL}
            onClick={() => scrollToSection('gallery')}
          >
            {t('nav.gallery')}
          </MobileNavLink>
          <MobileNavLink
            $isRTL={isRTL}
            onClick={() => scrollToSection('map')}
          >
            {t('nav.map')}
          </MobileNavLink>
          <MobileNavLink
            $isRTL={isRTL}
            onClick={() => scrollToSection('contact')}
          >
            {t('nav.contact')}
          </MobileNavLink>
        </MobileMenu>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default MobileHeader;
