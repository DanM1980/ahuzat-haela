import React from 'react';
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
  padding: ${props => props.$isScrolled ? '0.3rem 0' : '1.2rem 0'};
  border: ${props => props.$isScrolled ? '1px solid rgba(44, 85, 48, 0.1)' : '2px solid rgba(44, 85, 48, 0.2)'};
  border-radius: ${props => props.$isScrolled ? '0 0 8px 8px' : '0 0 20px 20px'};
  box-shadow: ${props => props.$isScrolled ? '0 2px 10px rgba(44, 85, 48, 0.05)' : '0 4px 20px rgba(44, 85, 48, 0.1)'};
  width: 100%;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 1.5% auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
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
  font-size: ${props => props.$isScrolled ? '1.2rem' : '1.5rem'};
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
  width: ${props => props.$isScrolled ? '1.2rem' : '1.4rem'};
  height: ${props => props.$isScrolled ? '1.2rem' : '1.4rem'};
  fill: rgb(41 37 36 / 1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CenterSection = styled.nav<{ $isRTL: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;

  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const NavLink = styled.a<{ $isRTL: boolean; $isScrolled: boolean }>`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: ${props => props.$isScrolled ? '1.3rem' : '1.7rem'};
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    color: rgb(41 37 36 / 1);
    transform: scale(1.1);
  }
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: absolute;
  right: 0;

  &:hover {
    transform: scale(1.02);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SiteName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: -1rem;
`;

const SiteNameHebrew = styled.div<{ $isScrolled: boolean }>`
  font-size: ${props => props.$isScrolled ? '1.3rem' : '1.6rem'};
  font-weight: bold;
  color: rgb(41 37 36 / 1);
  line-height: 1.2;
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SiteNameEnglish = styled.div<{ $isScrolled: boolean }>`
  font-size: ${props => props.$isScrolled ? '1.3rem' : '1.6rem'};
  font-weight: bold;
  color: rgb(41 37 36 / 1);
  line-height: 1.2;
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const LogoImage = styled.img<{ $isScrolled: boolean }>`
  width: ${props => props.$isScrolled ? '90px' : '120px'};
  height: ${props => props.$isScrolled ? '90px' : '120px'};
  object-fit: contain;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const DesktopHeader: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const isScrolled = useScrollEffect(50);
  const { scrollToSection, scrollToTop } = useScrollToSection();
  const isRTL = language === 'he';

  return (
    <HeaderContainer $isScrolled={isScrolled}>
      <HeaderContent>
        {/* Left Section - Language Switcher */}
        <LeftSection>
          <LanguageSwitcher>
            <LanguageButton
              $isScrolled={isScrolled}
              onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
            >
              <GlobeIcon $isScrolled={isScrolled} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </GlobeIcon>
              {language === 'he' ? 'EN' : 'HE'}
            </LanguageButton>
          </LanguageSwitcher>
        </LeftSection>

        {/* Center Section - Navigation */}
        <CenterSection $isRTL={isRTL}>
          <NavLink 
            $isRTL={isRTL}
            $isScrolled={isScrolled}
            onClick={() => scrollToSection('gallery')}
          >
            {t('nav.gallery')}
          </NavLink>

          <NavLink 
            $isRTL={isRTL}
            $isScrolled={isScrolled}
            onClick={() => scrollToSection('contact')}
          >
            {t('nav.contact')}
          </NavLink>
        </CenterSection>

        {/* Right Section - Logo and Site Name */}
        <RightSection onClick={scrollToTop}>
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
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default DesktopHeader;
