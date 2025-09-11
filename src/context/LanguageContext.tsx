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
    'nav.gallery': 'גלריה',
    'nav.contact': 'צור קשר',

    // Hero section
    'hero.title': 'אחוזת האלה',
    'hero.subtitle': 'מתחם אירוח בדרום רמת הגולן',
    'hero.description': 'ארבע יחידות אירוח עם ג\'קוזי, בריכה מחוממת וסאונה יבשה בנאות גולן',
    'hero.cta': 'גלה עוד',


    // Gallery section
    'gallery.title': 'הצצה לאחוזה',
    'gallery.subtitle': 'גלו את הקסם של יחידות האירוח הכפריות שלנו',

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
    'footer.quick_links': 'קישורים מהירים',
    'footer.company_name': 'אחוזת האלה',
    'footer.location': 'נאות גולן, ישראל',
    'footer.phone': 'טל: 052-6658209',
    'footer.description': 'צימרים יוקרתיים בלב הגולן',

    // Common
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.success': 'הצלחה',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',

    // Hero section
    'hero.title': 'Ella Estate',
    'hero.subtitle': 'A countryside retreat in southern Golan',
    'hero.description': 'Four luxurious suites featuring private jacuzzis, a heated pool and dry sauna — located in Neot Golan.',
    'hero.cta': 'Discover More',


    // Gallery section
    'gallery.title': 'Estate Preview',
    'gallery.subtitle': 'Discover the magic of our rural accommodation units',

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
    'footer.rights': 'All rights reserved to Ella Estate',
    'footer.follow': 'Follow Us',
    'footer.quick_links': 'Quick Links',
    'footer.company_name': 'Ella Estate',
    'footer.location': 'Neot Golan, Israel',
    'footer.phone': 'Tel: +972-52-6658209',
    'footer.description': 'Luxurious accommodation units in the heart of the Golan',

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

  const t = React.useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  }, [language]);

  const value: LanguageContextType = React.useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, t]);

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
