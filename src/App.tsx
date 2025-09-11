import React, { Suspense, lazy, memo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Map from './components/Map/Map';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
// OAuth callback will be handled via popup, no routing needed

// Lazy load heavy components
const Gallery = lazy(() => import('./components/Gallery/Gallery'));

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  body {
    line-height: 1.6;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 400;
  }

  html {
    scroll-behavior: smooth;
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
  }

  /* Global font settings */
  * {
    font-family: "Inter", "Heebo", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
  }

  /* Typography hierarchy */
  h1, h2, h3, h4, h5, h6 {
    font-family: "Inter", "Heebo", sans-serif !important;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  h1 {
    font-weight: 700;
    font-size: clamp(2.5rem, 5vw, 4rem);
  }

  h2 {
    font-weight: 600;
    font-size: clamp(2rem, 4vw, 3rem);
  }

  h3 {
    font-weight: 600;
    font-size: clamp(1.5rem, 3vw, 2rem);
  }

  p, span, div, a, button, input, textarea, select {
    font-family: "Inter", "Heebo", sans-serif !important;
    font-weight: 400;
  }

  /* Special styling for Hebrew text */
  [dir="rtl"] {
    font-family: "Heebo", "Inter", sans-serif !important;
  }

  [dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3, [dir="rtl"] h4, [dir="rtl"] h5, [dir="rtl"] h6 {
    font-family: "Heebo", "Inter", sans-serif !important;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
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
        <Suspense fallback={<div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>טוען גלריה...</div>}>
          <Gallery />
        </Suspense>
        <Map />
        <Contact />
        <Footer />
        <ScrollToTop />
      </AppContainer>
    </LanguageProvider>
  );
}

export default memo(App);
