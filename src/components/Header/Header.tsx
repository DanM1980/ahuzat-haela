import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const HeaderContainer = styled.header<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.isScrolled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: ${props => props.isScrolled ? 'blur(5px)' : 'blur(10px)'};
  transition: all 0.3s ease;
  padding: ${props => props.isScrolled ? '0.2rem 0' : '1rem 0'};
  border: ${props => props.isScrolled ? '1px solid rgba(44, 85, 48, 0.1)' : '2px solid rgba(44, 85, 48, 0.2)'};
  border-radius: ${props => props.isScrolled ? '0 0 10px 10px' : '0 0 20px 20px'};
  box-shadow: ${props => props.isScrolled ? '0 2px 10px rgba(44, 85, 48, 0.05)' : '0 4px 20px rgba(44, 85, 48, 0.1)'};
  width: 100%;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100%;
  align-items: center;
  position: relative;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  justify-self: end;
  grid-column: 3;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -1.5rem;
`;

const LogoImage = styled.img<{ isScrolled: boolean }>`
  width: ${props => props.isScrolled ? '90px' : '150px'};
  height: ${props => props.isScrolled ? '90px' : '150px'};
  object-fit: contain;
  transition: all 0.3s ease;
  opacity: ${props => props.isScrolled ? 1 : 0};
  visibility: ${props => props.isScrolled ? 'visible' : 'hidden'};
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    opacity: 1;
    visibility: visible;
  }
`;

const SiteName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SiteNameHebrew = styled.div<{ isScrolled: boolean }>`
  font-size: ${props => props.isScrolled ? '1.3rem' : '2.2rem'};
  font-weight: bold;
  color: rgb(41 37 36 / 1);
  line-height: 1.2;
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.3s ease;
  opacity: ${props => props.isScrolled ? 1 : 0};
  visibility: ${props => props.isScrolled ? 'visible' : 'hidden'};
  
  @media (max-width: 768px) {
    opacity: 1;
    visibility: visible;
  }
`;

const SiteNameEnglish = styled.div<{ isScrolled: boolean }>`
  font-size: ${props => props.isScrolled ? '1.3rem' : '2.2rem'};
  font-weight: bold;
  color: rgb(41 37 36 / 1);
  line-height: 1.2;
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.3s ease;
  opacity: ${props => props.isScrolled ? 1 : 0};
  visibility: ${props => props.isScrolled ? 'visible' : 'hidden'};
  
  @media (max-width: 768px) {
    opacity: 1;
    visibility: visible;
  }
`;

const Nav = styled.nav<{ isRTL: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-self: center;
  grid-column: 2;

  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const NavLink = styled.a<{ isRTL: boolean; isScrolled: boolean }>`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: ${props => props.isScrolled ? '1.3rem' : '1.7rem'};
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: rgb(41 37 36 / 1);
    transform: scale(1.1);
  }
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const LanguageSwitcher = styled.div`
  display: flex;
  align-items: center;
`;

const LanguageButton = styled.button<{ isScrolled: boolean }>`
  background: transparent;
  color: #333;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: ${props => props.isScrolled ? '1.2rem' : '1.5rem'};
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

const GlobeIcon = styled.svg`
  width: 1.1rem;
  height: 1.1rem;
  fill: rgb(41 37 36 / 1);
`;

const WhatsAppButton = styled.a`
  background: #25D366;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #128C7E;
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`;

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const isRTL = language === 'he';

  return (
    <HeaderContainer isScrolled={isScrolled}>
      <HeaderContent>
        {/* Language Switcher - Left */}
        <LanguageSwitcher>
          <LanguageButton
            isScrolled={isScrolled}
            onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
          >
            {language === 'he' ? 'English' : 'עברית'}
            <GlobeIcon viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </GlobeIcon>
          </LanguageButton>
        </LanguageSwitcher>
        
        {/* Navigation - Center */}
        <Nav isRTL={isRTL}>
          <NavLink 
            isRTL={isRTL}
            isScrolled={isScrolled}
            onClick={() => scrollToSection('gallery')}
          >
            {t('nav.gallery')}
          </NavLink>

          <NavLink 
            isRTL={isRTL}
            isScrolled={isScrolled}
            onClick={() => scrollToSection('contact')}
          >
            {t('nav.contact')}
          </NavLink>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </MobileMenuButton>
        </Nav>
        
        {/* Logo and Site Name - Right */}
        <LogoSection onClick={scrollToTop}>
          <SiteName>
            <SiteNameHebrew isScrolled={isScrolled}>אחוזת האלה</SiteNameHebrew>
            <SiteNameEnglish isScrolled={isScrolled}>Ella Estate</SiteNameEnglish>
          </SiteName>
          <LogoContainer>
            <LogoImage 
              isScrolled={isScrolled}
              src="/logo.png" 
              alt="אחוזת האלה - Ella Estate"
              onError={(e) => {
                // Fallback to logo-bw.png if logo.png fails
                e.currentTarget.src = "/logo-bw.png";
              }}
            />
          </LogoContainer>
        </LogoSection>
        
        <MobileMenu isOpen={isMobileMenuOpen}>
          <NavLink 
            isRTL={isRTL}
            isScrolled={isScrolled}
            onClick={() => scrollToSection('gallery')}
          >
            {t('nav.gallery')}
          </NavLink>
          <NavLink 
            isRTL={isRTL}
            isScrolled={isScrolled}
            onClick={() => scrollToSection('contact')}
          >
            {t('nav.contact')}
          </NavLink>
        </MobileMenu>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
