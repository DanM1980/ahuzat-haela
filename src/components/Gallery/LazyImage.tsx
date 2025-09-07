import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  objectFit?: string;
}

const ImageContainer = styled.div<{ loaded: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
  transition: opacity 0.3s ease;
  opacity: ${props => props.loaded ? 1 : 0.7};
`;

const StyledImage = styled.img<{ loaded: boolean; objectFit?: string }>`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  transition: opacity 0.3s ease;
  opacity: ${props => props.loaded ? 1 : 0};
`;

const LoadingPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, style, children, objectFit }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <ImageContainer ref={imgRef} loaded={loaded} className={className} style={style}>
      {!loaded && <LoadingPlaceholder />}
      {inView && (
        <StyledImage
          src={src}
          alt={alt}
          loaded={loaded}
          objectFit={objectFit}
          onLoad={handleLoad}
          loading="lazy"
        />
      )}
      {children}
    </ImageContainer>
  );
};

export default LazyImage;
