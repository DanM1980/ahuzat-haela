import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const HeaderContainer = styled.header<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  backdrop-filter: ${props => props.isScrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  padding: 1rem 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c5530;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled.a<{ isRTL: boolean }>`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #2c5530;
  }
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const LanguageSwitcher = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LanguageButton = styled.button<{ isActive: boolean }>`
  background: ${props => props.isActive ? '#2c5530' : 'transparent'};
  color: ${props => props.isActive ? 'white' : '#333'};
  border: 1px solid #2c5530;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: #2c5530;
    color: white;
  }
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

  const isRTL = language === 'he';

  return (
    <HeaderContainer isScrolled={isScrolled}>
      <HeaderContent>
        <Logo>אחוזת האלה</Logo>
        
        <Nav>
          <NavLink 
            isRTL={isRTL}
            onClick={() => scrollToSection('hero')}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink 
            isRTL={isRTL}
            onClick={() => scrollToSection('about')}
          >
            {t('nav.about')}
          </NavLink>
          <NavLink 
            isRTL={isRTL}
            onClick={() => scrollToSection('gallery')}
          >
            {t('nav.gallery')}
          </NavLink>
          <NavLink 
            isRTL={isRTL}
            onClick={() => scrollToSection('contact')}
          >
            {t('nav.contact')}
          </NavLink>
          
          <WhatsAppButton 
            href="https://wa.me/972501234567" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            💬 {t('contact.whatsapp')}
          </WhatsAppButton>
          
          <LanguageSwitcher>
            <LanguageButton
              isActive={language === 'he'}
              onClick={() => setLanguage('he')}
            >
              עברית
            </LanguageButton>
            <LanguageButton
              isActive={language === 'en'}
              onClick={() => setLanguage('en')}
            >
              English
            </LanguageButton>
          </LanguageSwitcher>
          
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </MobileMenuButton>
        </Nav>
        
        <MobileMenu isOpen={isMobileMenuOpen}>
          <NavLink 
            isRTL={isRTL}
            onClick={() => scrollToSection('hero')}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink 
            isRTL={isRTL}
            onClick={() => scrollToSection('about')}
          >
            {t('nav.about')}
          </NavLink>
          <NavLink 
            isRTL={isRTL}
            onClick={() => scrollToSection('gallery')}
          >
            {t('nav.gallery')}
          </NavLink>
          <NavLink 
            isRTL={isRTL}
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
