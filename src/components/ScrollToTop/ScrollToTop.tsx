import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ScrollButton = styled.button<{ isVisible: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #2c5530;
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(44, 85, 48, 0.3);

  &:hover {
    background: #4a7c59;
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

export default ScrollToTop;
