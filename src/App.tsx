import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Gallery from './components/Gallery/Gallery';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    line-height: 1.6;
    color: #333;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(41 37 36 / 1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #4a7c59;
  }

  /* Selection color */
  ::selection {
    background: rgb(41 37 36 / 1);
    color: white;
  }

  ::-moz-selection {
    background: rgb(41 37 36 / 1);
    color: white;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
`;

function App() {
  return (
    <LanguageProvider>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <Hero />
        <Features />
        <Gallery />
        <Contact />
        <Footer />
        <ScrollToTop />
      </AppContainer>
    </LanguageProvider>
  );
}

export default App;
