import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const ContactSection = styled.section`
  padding: 5rem 0;
  background: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2<{ isRTL: boolean }>`
  text-align: center;
  font-size: 2.5rem;
  color: #2c5530;
  margin-bottom: 3rem;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div<{ isRTL: boolean }>`
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const InfoTitle = styled.h3`
  font-size: 1.8rem;
  color: #2c5530;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const InfoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: #2c5530;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  color: #666;
  font-size: 0.95rem;
`;

const ContactForm = styled.form<{ isRTL: boolean }>`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #2c5530;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #2c5530;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #2c5530;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    background: #4a7c59;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const WhatsAppButton = styled.a`
  width: 100%;
  background: #25D366;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #128C7E;
    color: white;
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
`;

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const isRTL = language === 'he';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📍',
      label: t('contact.address'),
      value: language === 'he' ? 'רחוב הרצל 123, תל אביב' : '123 Herzl Street, Tel Aviv'
    },
    {
      icon: '📞',
      label: t('contact.phone_label'),
      value: '+972-50-123-4567'
    },
    {
      icon: '✉️',
      label: t('contact.email_label'),
      value: 'info@ahuzat-haela.co.il'
    }
  ];

  return (
    <ContactSection id="contact">
      <Container>
        <SectionTitle isRTL={isRTL}>{t('contact.title')}</SectionTitle>
        
        <ContactContent>
          <ContactInfo isRTL={isRTL}>
            <InfoTitle>{language === 'he' ? 'פרטי התקשרות' : 'Contact Information'}</InfoTitle>
            
            {contactInfo.map((info, index) => (
              <InfoItem key={index}>
                <InfoIcon>{info.icon}</InfoIcon>
                <InfoText>
                  <InfoLabel>{info.label}</InfoLabel>
                  <InfoValue>{info.value}</InfoValue>
                </InfoText>
              </InfoItem>
            ))}
          </ContactInfo>
          
          <ContactForm isRTL={isRTL} onSubmit={handleSubmit}>
            {submitStatus === 'success' && (
              <SuccessMessage>
                {language === 'he' ? 'ההודעה נשלחה בהצלחה!' : 'Message sent successfully!'}
              </SuccessMessage>
            )}
            
            {submitStatus === 'error' && (
              <ErrorMessage>
                {language === 'he' ? 'שגיאה בשליחת ההודעה. נסה שוב.' : 'Error sending message. Please try again.'}
              </ErrorMessage>
            )}
            
            <FormGroup>
              <Label htmlFor="name">{t('contact.name')}</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">{t('contact.email')}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">{t('contact.phone')}</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="message">{t('contact.message')}</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('contact.send')}
            </SubmitButton>
            
            <WhatsAppButton 
              href="https://wa.me/972501234567" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              💬 {t('contact.whatsapp')}
            </WhatsAppButton>
          </ContactForm>
        </ContactContent>
      </Container>
    </ContactSection>
  );
};

export default Contact;
