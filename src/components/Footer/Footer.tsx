import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const FooterSection = styled.footer`
  background: #2c5530;
  color: white;
  padding: 3rem 0 1rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterColumn = styled.div<{ isRTL: boolean }>`
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const ColumnTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: white;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const CompanyInfo = styled.div`
  margin-bottom: 1rem;
`;

const CompanyName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
`;

const CompanyDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ContactInfo = styled.div`
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContactIcon = styled.span`
  width: 20px;
  text-align: center;
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'he';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { label: t('nav.home'), action: () => scrollToSection('hero') },
    { label: t('nav.about'), action: () => scrollToSection('about') },
    { label: t('nav.gallery'), action: () => scrollToSection('gallery') },
    { label: t('nav.contact'), action: () => scrollToSection('contact') }
  ];

  const services = [
    language === 'he' ? 'אירוח משפחות' : 'Family Accommodation',
    language === 'he' ? 'אירוח קבוצות' : 'Group Accommodation',
    language === 'he' ? 'צימרים זוגיים' : 'Couple Cottages',
    language === 'he' ? 'אירועים פרטיים' : 'Private Events'
  ];

  return (
    <FooterSection>
      <Container>
        <FooterContent>
          <FooterColumn isRTL={isRTL}>
            <CompanyInfo>
              <CompanyName>אחוזת האלה</CompanyName>
              <CompanyDescription>
                {language === 'he' 
                  ? 'אחוזת האלה מציעה צימרים מפנקים לאירוח משפחות וקבוצות, עם שירות אישי ומקצועי לכל אורח.'
                  : 'Ahuzat HaEla offers luxurious cottages for family and group accommodation, with personal and professional service for every guest.'
                }
              </CompanyDescription>
            </CompanyInfo>
            
            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook">
                📘
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                📷
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                💼
              </SocialLink>
              <SocialLink href="#" aria-label="WhatsApp">
                💬
              </SocialLink>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn isRTL={isRTL}>
            <ColumnTitle>{language === 'he' ? 'קישורים מהירים' : 'Quick Links'}</ColumnTitle>
            {quickLinks.map((link, index) => (
              <FooterLink key={index} onClick={link.action} style={{ cursor: 'pointer' }}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
          
          <FooterColumn isRTL={isRTL}>
            <ColumnTitle>{language === 'he' ? 'השירותים שלנו' : 'Our Services'}</ColumnTitle>
            {services.map((service, index) => (
              <FooterLink key={index} href="#">
                {service}
              </FooterLink>
            ))}
          </FooterColumn>
          
          <FooterColumn isRTL={isRTL}>
            <ColumnTitle>{language === 'he' ? 'צור קשר' : 'Contact Us'}</ColumnTitle>
            <ContactInfo>
              <ContactIcon>📍</ContactIcon>
              {language === 'he' ? 'רחוב הרצל 123, תל אביב' : '123 Herzl Street, Tel Aviv'}
            </ContactInfo>
            <ContactInfo>
              <ContactIcon>📞</ContactIcon>
              +972-50-123-4567
            </ContactInfo>
            <ContactInfo>
              <ContactIcon>✉️</ContactIcon>
              info@ahuzat-haela.co.il
            </ContactInfo>
          </FooterColumn>
        </FooterContent>
        
        <FooterBottom>
          <p>{t('footer.rights')} © {new Date().getFullYear()}</p>
        </FooterBottom>
      </Container>
    </FooterSection>
  );
};

export default Footer;
