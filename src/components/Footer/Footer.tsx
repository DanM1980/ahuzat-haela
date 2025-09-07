import React, { memo } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollToSection } from '../../hooks/useScrollToSection';

const FooterSection = styled.footer`
  background: #2e2e2e;
  color: white;
  padding: 3rem 0 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterColumn = styled.div<{ isRTL: boolean }>`
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ColumnTitle = styled.h3<{ isRTL: boolean }>`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #fdd835;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  font-weight: 600;
`;

const FooterLink = styled.a`
  color: #cccccc;
  text-decoration: none;
  display: block;
  margin-bottom: 0.8rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  font-size: 1rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fdd835;
  }
`;

const CompanyName = styled.div<{ isRTL: boolean }>`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #fdd835;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
`;

const ContactInfo = styled.div`
  margin-bottom: 0.8rem;
  color: #cccccc;
  font-family: "Inter", "Heebo", sans-serif !important;
  font-size: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease;
  font-size: 1.5rem;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const InstagramIcon = styled(SocialLink)`
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
`;

const FacebookIcon = styled(SocialLink)`
  background: #1877f2;
`;

const WhatsAppIcon = styled(SocialLink)`
  background: #25D366;
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  text-align: center;
  color: #cccccc;
  font-size: 0.9rem;
  font-family: "Inter", "Heebo", sans-serif !important;
`;

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { scrollToSection } = useScrollToSection();
  const isRTL = language === 'he';

  const quickLinks = React.useMemo(() => [
    { label: t('nav.home'), action: () => scrollToSection('hero') },
    { label: t('nav.gallery'), action: () => scrollToSection('gallery') },
    { label: t('nav.contact'), action: () => scrollToSection('contact') }
  ], [t, scrollToSection]);

  return (
    <FooterSection>
      <Container>
        <FooterContent>
          {isRTL ? (
            // Hebrew layout: Follow Us, Quick Links, Company Info
            <>
              {/* עמודה ראשונה - עקבו אחרינו */}
              <FooterColumn isRTL={isRTL}>
                <ColumnTitle isRTL={isRTL}>{t('footer.follow')}</ColumnTitle>
                <SocialLinks>
                  <InstagramIcon href="https://www.instagram.com/ellazimer/" target="_blank" aria-label="Instagram">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </InstagramIcon>
                  <FacebookIcon href="https://www.facebook.com/profile.php?id=100064391633560" target="_blank" aria-label="Facebook">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </FacebookIcon>
                  <WhatsAppIcon href="https://wa.me/972526658209" target="_blank" aria-label="WhatsApp">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      <path d="M13 8H7"/>
                      <path d="M17 12H7"/>
                    </svg>
                  </WhatsAppIcon>
                </SocialLinks>
              </FooterColumn>
              
              {/* עמודה שנייה - קישורים מהירים */}
              <FooterColumn isRTL={isRTL}>
                <ColumnTitle isRTL={isRTL}>{t('footer.quick_links')}</ColumnTitle>
                {quickLinks.map((link, index) => (
                  <FooterLink key={index} onClick={link.action} style={{ cursor: 'pointer' }}>
                    {link.label}
                  </FooterLink>
                ))}
              </FooterColumn>
              
              {/* עמודה שלישית - אחוזת האלה */}
              <FooterColumn isRTL={isRTL}>
                <CompanyName isRTL={isRTL}>{t('footer.company_name')}</CompanyName>
                <ContactInfo>{t('footer.location')}</ContactInfo>
                <ContactInfo>{t('footer.phone')}</ContactInfo>
                <ContactInfo>{t('footer.description')}</ContactInfo>
              </FooterColumn>
            </>
          ) : (
            // English layout: Company Info, Quick Links, Follow Us
            <>
              {/* עמודה ראשונה - Company Info */}
              <FooterColumn isRTL={isRTL}>
                <CompanyName isRTL={isRTL}>{t('footer.company_name')}</CompanyName>
                <ContactInfo>{t('footer.location')}</ContactInfo>
                <ContactInfo>{t('footer.phone')}</ContactInfo>
                <ContactInfo>{t('footer.description')}</ContactInfo>
              </FooterColumn>
              
              {/* עמודה שנייה - Quick Links */}
              <FooterColumn isRTL={isRTL}>
                <ColumnTitle isRTL={isRTL}>{t('footer.quick_links')}</ColumnTitle>
                {quickLinks.map((link, index) => (
                  <FooterLink key={index} onClick={link.action} style={{ cursor: 'pointer' }}>
                    {link.label}
                  </FooterLink>
                ))}
              </FooterColumn>
              
              {/* עמודה שלישית - Follow Us */}
              <FooterColumn isRTL={isRTL}>
                <ColumnTitle isRTL={isRTL}>{t('footer.follow')}</ColumnTitle>
                <SocialLinks>
                  <InstagramIcon href="https://www.instagram.com/ellazimer/" target="_blank" aria-label="Instagram">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </InstagramIcon>
                  <FacebookIcon href="https://www.facebook.com/profile.php?id=100064391633560" target="_blank" aria-label="Facebook">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </FacebookIcon>
                  <WhatsAppIcon href="https://wa.me/972526658209" target="_blank" aria-label="WhatsApp">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      <path d="M13 8H7"/>
                      <path d="M17 12H7"/>
                    </svg>
                  </WhatsAppIcon>
                </SocialLinks>
              </FooterColumn>
            </>
          )}
        </FooterContent>
        
        <FooterBottom>
          <p>{t('footer.rights')} © {new Date().getFullYear()}</p>
        </FooterBottom>
      </Container>
    </FooterSection>
  );
};

export default memo(Footer);
