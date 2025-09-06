import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'he' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation object
const translations = {
  he: {
    // Navigation
    'nav.home': 'בית',
    'nav.about': 'אודות',
    'nav.gallery': 'גלריה',
    'nav.contact': 'צור קשר',
    
    // Hero section
    'hero.title': 'אחוזת האלה',
    'hero.subtitle': 'מתחם אירוח בדרום רמת הגולן',
    'hero.description': '4 יחידות אירוח עם ג\'קוזי, בריכה מחוממת וסאונה יבשה בנאות גולן',
    'hero.cta': 'גלה עוד',
    
    // About section
    'about.title': 'אודותינו',
    'about.description': 'אחוזת האלה מציעה צימרים מפנקים לאירוח משפחות וקבוצות, עם שירות אישי ומקצועי.',
    
    // Gallery section
    'gallery.title': 'גלריה',
    'gallery.subtitle': 'הצימרים שלנו',
    
    // Contact section
    'contact.title': 'צור קשר',
    'contact.name': 'שם',
    'contact.email': 'אימייל',
    'contact.phone': 'טלפון',
    'contact.message': 'הודעה',
    'contact.send': 'שלח הודעה',
    'contact.address': 'כתובת',
    'contact.phone_label': 'טלפון',
    'contact.email_label': 'אימייל',
    'contact.whatsapp': 'שלח הודעה בווצאפ',
    
    // Footer
    'footer.rights': 'כל הזכויות שמורות לאחוזת האלה',
    'footer.follow': 'עקבו אחרינו',
    
    // Common
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.success': 'הצלחה',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    
    // Hero section
    'hero.title': 'Ahuzat HaEla',
    'hero.subtitle': 'Accommodation Complex in Southern Golan Heights',
    'hero.description': '4 accommodation units with jacuzzi, heated pool and dry sauna in Neot Golan',
    'hero.cta': 'Learn More',
    
    // About section
    'about.title': 'About Us',
    'about.description': 'Ahuzat HaEla offers luxurious cottages for family and group accommodation, with personal and professional service.',
    
    // Gallery section
    'gallery.title': 'Gallery',
    'gallery.subtitle': 'Our Cottages',
    
    // Contact section
    'contact.title': 'Contact Us',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.address': 'Address',
    'contact.phone_label': 'Phone',
    'contact.email_label': 'Email',
    'contact.whatsapp': 'Send WhatsApp Message',
    
    // Footer
    'footer.rights': 'All rights reserved to Ahuzat HaEla',
    'footer.follow': 'Follow Us',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('he');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
