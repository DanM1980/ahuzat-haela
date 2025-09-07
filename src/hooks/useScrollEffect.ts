import { useState, useLayoutEffect } from 'react';

export const useScrollEffect = (threshold: number = 50) => {
  const [isScrolled, setIsScrolled] = useState(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    return scrollY > threshold;
  });

  useLayoutEffect(() => {
    let lastScrollY = 0;
    let animationFrameId: number;
    
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrolled = scrollY > threshold;
      
      if (scrollY !== lastScrollY) {
        setIsScrolled(scrolled);
        lastScrollY = scrollY;
      }
      
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    const initialScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    setIsScrolled(initialScrollY > threshold);
    lastScrollY = initialScrollY;
    
    animationFrameId = requestAnimationFrame(handleScroll);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [threshold]);

  return isScrolled;
};
