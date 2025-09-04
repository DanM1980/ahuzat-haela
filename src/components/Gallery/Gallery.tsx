import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';

const GallerySection = styled.section`
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
  margin-bottom: 1rem;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const SectionSubtitle = styled.p<{ isRTL: boolean }>`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const GalleryContainer = styled.div`
  position: relative;
  margin-bottom: 3rem;
  overflow: visible;
  padding: 0 4rem;
`;

const GalleryWrapper = styled.div<{ currentPage: number }>`
  display: flex;
  width: 200%;
  transform: translateX(${props => -props.currentPage * 50}%);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
  height: 500px;
  width: 50%;
  flex-shrink: 0;
  border-radius: 10px;
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(44, 85, 48, 0.9);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 20;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(44, 85, 48, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PrevScrollButton = styled(ScrollButton)`
  left: -1.5rem;
`;

const NextScrollButton = styled(ScrollButton)`
  right: -1.5rem;
`;

const GalleryIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const IndicatorDot = styled.div<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.isActive ? '#2c5530' : '#ccc'};
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #2c5530;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const GalleryImage = styled.div<{ imageUrl: string }>`
  height: 250px;
  background: linear-gradient(45deg, #2c5530, #4a7c59);
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(44, 85, 48, 0.7), rgba(74, 124, 89, 0.7));
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${GalleryItem}:hover & {
    opacity: 1;
  }
`;

const OverlayIcon = styled.div`
  color: white;
  font-size: 2rem;
`;

const GalleryInfo = styled.div`
  padding: 1.5rem;
  background: white;
`;

const PropertyTitle = styled.h3`
  font-size: 1.2rem;
  color: #2c5530;
  margin-bottom: 0.5rem;
`;

const PropertyDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
`;

const ModalImageContainer = styled.div<{ currentIndex: number }>`
  display: flex;
  width: ${props => props.currentIndex !== null ? cottages.length * 100 : 100}%;
  transform: translateX(${props => props.currentIndex !== null ? -props.currentIndex * (100 / cottages.length) : 0}%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
  width: ${props => 100 / cottages.length}%;
  flex-shrink: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  
  &:hover {
    opacity: 0.7;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 20px;
`;

const NextButton = styled(NavigationButton)`
  right: 20px;
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

// Sample cottage data
const cottages = [
  {
    id: 1,
    title: 'צימר משפחתי',
    titleEn: 'Family Cottage',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop'
  },
  {
    id: 2,
    title: 'צימר זוגי רומנטי',
    titleEn: 'Romantic Couple Cottage',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop'
  },
  {
    id: 3,
    title: 'צימר לקבוצות',
    titleEn: 'Group Cottage',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=300&fit=crop'
  },
  {
    id: 4,
    title: 'צימר עם נוף',
    titleEn: 'Scenic View Cottage',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop'
  },
  {
    id: 5,
    title: 'צימר ליד הים',
    titleEn: 'Beachside Cottage',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop'
  },
  {
    id: 6,
    title: 'צימר כפרי',
    titleEn: 'Country Cottage',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop'
  },
  {
    id: 7,
    title: 'צימר עם בריכה',
    titleEn: 'Cottage with Pool',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500&h=300&fit=crop'
  },
  {
    id: 8,
    title: 'צימר עם ג\'קוזי',
    titleEn: 'Cottage with Jacuzzi',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop'
  },
  {
    id: 9,
    title: 'צימר עם מרפסת',
    titleEn: 'Cottage with Balcony',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop'
  },
  {
    id: 10,
    title: 'צימר עם גינה',
    titleEn: 'Cottage with Garden',
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=500&h=300&fit=crop'
  },
  {
    id: 11,
    title: 'צימר עם ברביקיו',
    titleEn: 'Cottage with BBQ',
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=500&h=300&fit=crop'
  },
  {
    id: 12,
    title: 'צימר עם נוף הרים',
    titleEn: 'Cottage with Mountain View',
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=500&h=300&fit=crop'
  }
];

const Gallery: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const isRTL = language === 'he';

  const imagesPerPage = 6;
  const totalPages = Math.ceil(cottages.length / imagesPerPage);
  
  // Create pages array
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(cottages.slice(i * imagesPerPage, (i + 1) * imagesPerPage));
  }

  const openModal = (imageIndex: number) => {
    setSelectedImageIndex(currentPage * imagesPerPage + imageIndex);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < cottages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const scrollToPrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const scrollToNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex !== null) {
      // Modal navigation
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    } else {
      // Gallery navigation
      if (e.key === 'ArrowLeft') {
        scrollToPrevious();
      } else if (e.key === 'ArrowRight') {
        scrollToNext();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, currentPage]);

  return (
    <GallerySection id="gallery">
      <Container>
        <SectionTitle isRTL={isRTL}>{t('gallery.title')}</SectionTitle>
        <SectionSubtitle isRTL={isRTL}>{t('gallery.subtitle')}</SectionSubtitle>
        
        <GalleryContainer>
          <PrevScrollButton 
            onClick={scrollToPrevious} 
            disabled={currentPage === 0}
          >
            ‹
          </PrevScrollButton>
          
          <GalleryWrapper currentPage={currentPage}>
            {pages.map((pageImages, pageIndex) => (
              <GalleryGrid key={pageIndex}>
                {pageImages.map((cottage, index) => (
                  <GalleryItem key={cottage.id} onClick={() => openModal(index)}>
                    <GalleryImage imageUrl={cottage.image}>
                      <ImageOverlay>
                        <OverlayIcon>🔍</OverlayIcon>
                      </ImageOverlay>
                    </GalleryImage>
                  </GalleryItem>
                ))}
              </GalleryGrid>
            ))}
          </GalleryWrapper>
          
          <NextScrollButton 
            onClick={scrollToNext} 
            disabled={currentPage === totalPages - 1}
          >
            ›
          </NextScrollButton>
          
          <GalleryIndicator>
            {Array.from({ length: totalPages }, (_, index) => (
              <IndicatorDot
                key={index}
                isActive={index === currentPage}
                onClick={() => goToPage(index)}
              />
            ))}
          </GalleryIndicator>
        </GalleryContainer>
      </Container>
      
      <Modal isOpen={selectedImageIndex !== null} onClick={closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={closeModal}>×</CloseButton>
          
          {selectedImageIndex !== null && (
            <>
              <PrevButton 
                onClick={goToPrevious} 
                disabled={selectedImageIndex === 0}
              >
                ‹
              </PrevButton>
              
              <ModalImageContainer currentIndex={selectedImageIndex}>
                {cottages.map((cottage, index) => (
                  <ModalImage 
                    key={cottage.id}
                    src={cottage.image} 
                    alt={language === 'he' ? cottage.title : cottage.titleEn} 
                  />
                ))}
              </ModalImageContainer>
              
              <NextButton 
                onClick={goToNext} 
                disabled={selectedImageIndex === cottages.length - 1}
              >
                ›
              </NextButton>
              
              <ImageCounter>
                {selectedImageIndex + 1} / {cottages.length}
              </ImageCounter>
            </>
          )}
        </ModalContent>
      </Modal>
    </GallerySection>
  );
};

export default Gallery;
