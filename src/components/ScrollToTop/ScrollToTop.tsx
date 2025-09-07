import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';

const ScrollButton = styled.button<{ isVisible: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #a16207;
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  cursor: pointer;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(161, 98, 7, 0.3);

  &:hover {
    background: #8a5206;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
`;

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <ScrollButton isVisible={isVisible} onClick={scrollToTop}>
      ↑
    </ScrollButton>
  );
};

export default memo(ScrollToTop);
