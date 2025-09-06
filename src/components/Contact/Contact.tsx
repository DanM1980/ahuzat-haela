import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const ContactSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #ff8c00, #ffa500);
  text-align: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const MainTitle = styled.h2<{ isRTL: boolean }>`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Playfair Display", serif'} !important;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const Subtitle = styled.p<{ isRTL: boolean }>`
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  color: white;
  margin-bottom: 3rem;
  opacity: 0.95;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const WhatsAppButton = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #25D366;
  color: white;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
  min-width: 280px;
  
  &:hover {
    background: #128C7E;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
    color: white;
  }
  
  @media (max-width: 768px) {
    min-width: 250px;
    padding: 1rem 2rem;
  }
`;

const PhoneButton = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  color: #333;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: "Inter", "Heebo", sans-serif !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 280px;
  
  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    color: #333;
  }
  
  @media (max-width: 768px) {
    min-width: 250px;
    padding: 1rem 2rem;
  }
`;

const ButtonIcon = styled.div`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'he';

  return (
    <ContactSection id="contact">
      <Container>
        <MainTitle isRTL={isRTL}>
          {language === 'he' ? 'מוכנים לחוויה בלתי נשכחת?' : 'Ready for an Unforgettable Experience?'}
        </MainTitle>
        
        <Subtitle isRTL={isRTL}>
          {language === 'he' ? 'צרו קשר עכשיו לקבלת הצעת מחיר אישית' : 'Contact us now to receive a personal price quote'}
        </Subtitle>
        
        <ButtonsContainer>
          <WhatsAppButton 
            href="https://wa.me/972526658209" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ButtonIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <path d="M13 8H7"/>
                <path d="M17 12H7"/>
              </svg>
            </ButtonIcon>
            {language === 'he' ? 'שלחו הודעה בוואטסאפ' : 'Send WhatsApp Message'}
          </WhatsAppButton>
          
          <PhoneButton href="tel:+972526658209">
            <ButtonIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </ButtonIcon>
            {language === 'he' ? 'התקשרו: 052-6658209' : 'Call: +972-52-6658209'}
          </PhoneButton>
        </ButtonsContainer>
      </Container>
    </ContactSection>
  );
};

export default Contact;
