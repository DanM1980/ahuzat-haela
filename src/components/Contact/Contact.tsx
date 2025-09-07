import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const ContactSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #a16207, #8a5206);
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
  color: #a16207;
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
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
