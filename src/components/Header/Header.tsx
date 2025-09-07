import React, { useState, useEffect } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

const Header: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile ? <MobileHeader /> : <DesktopHeader />;
};

export default Header;
