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
  overflow: hidden;
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
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
  padding: 1rem;
  overflow: hidden;
`;

const ModalContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 10px;
  transition: opacity 0.3s ease-in-out;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2001;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const NavigationButton = styled.button`
  position: fixed;
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
  transition: all 0.3s ease;
  z-index: 2001;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: translateY(-50%);
    
    &:hover {
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.5);
    }
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 20px;
`;

const NextButton = styled(NavigationButton)`
  right: 20px;
`;

const ImageCounter = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  z-index: 2001;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

// Gallery images data
const cottages = [
  {
    id: 1,
    title: 'צימר משפחתי',
    titleEn: 'Family Cottage',
    thumbnail: '/gallery/thumbnails/_DSC5126-1.jpg',
    fullImage: '/gallery/_DSC5126-1.jpg'
  },
  {
    id: 2,
    title: 'צימר זוגי רומנטי',
    titleEn: 'Romantic Couple Cottage',
    thumbnail: '/gallery/thumbnails/_DSC5139-HDR-1.jpg',
    fullImage: '/gallery/_DSC5139-HDR-1.jpg'
  },
  {
    id: 3,
    title: 'צימר לקבוצות',
    titleEn: 'Group Cottage',
    thumbnail: '/gallery/thumbnails/_DSC5143-1.jpg',
    fullImage: '/gallery/_DSC5143-1.jpg'
  },
  {
    id: 4,
    title: 'צימר עם נוף',
    titleEn: 'Scenic View Cottage',
    thumbnail: '/gallery/thumbnails/_DSC5145-2.jpg',
    fullImage: '/gallery/_DSC5145-2.jpg'
  },
  {
    id: 5,
    title: 'צימר ליד הים',
    titleEn: 'Beachside Cottage',
    thumbnail: '/gallery/thumbnails/_DSC5146-1.jpg',
    fullImage: '/gallery/_DSC5146-1.jpg'
  },
  {
    id: 6,
    title: 'צימר כפרי',
    titleEn: 'Country Cottage',
    thumbnail: '/gallery/thumbnails/_DSC5152-HDR-1.jpg',
    fullImage: '/gallery/_DSC5152-HDR-1.jpg'
  },
  {
    id: 7,
    title: 'צימר עם בריכה',
    titleEn: 'Cottage with Pool',
    thumbnail: '/gallery/thumbnails/_DSC5159-1.jpg',
    fullImage: '/gallery/_DSC5159-1.jpg'
  },
  {
    id: 8,
    title: 'צימר עם ג\'קוזי',
    titleEn: 'Cottage with Jacuzzi',
    thumbnail: '/gallery/thumbnails/_DSC5160-2.jpg',
    fullImage: '/gallery/_DSC5160-2.jpg'
  },
  {
    id: 9,
    title: 'צימר עם מרפסת',
    titleEn: 'Cottage with Balcony',
    thumbnail: '/gallery/thumbnails/_DSC5164-1.jpg',
    fullImage: '/gallery/_DSC5164-1.jpg'
  },
  {
    id: 10,
    title: 'צימר עם גינה',
    titleEn: 'Cottage with Garden',
    thumbnail: '/gallery/thumbnails/_DSC5167-1.jpg',
    fullImage: '/gallery/_DSC5167-1.jpg'
  },
  {
    id: 11,
    title: 'צימר עם ברביקיו',
    titleEn: 'Cottage with BBQ',
    thumbnail: '/gallery/thumbnails/_DSC5188-HDR-1.jpg',
    fullImage: '/gallery/_DSC5188-HDR-1.jpg'
  },
  {
    id: 12,
    title: 'צימר עם נוף הרים',
    titleEn: 'Cottage with Mountain View',
    thumbnail: '/gallery/thumbnails/_DSC5201-1.jpg',
    fullImage: '/gallery/_DSC5201-1.jpg'
  },
  {
    id: 13,
    title: 'צימר עם נוף פנורמי',
    titleEn: 'Cottage with Panoramic View',
    thumbnail: '/gallery/thumbnails/_DSC5203-1.jpg',
    fullImage: '/gallery/_DSC5203-1.jpg'
  },
  {
    id: 14,
    title: 'צימר עם מרפסת פרטית',
    titleEn: 'Cottage with Private Balcony',
    thumbnail: '/gallery/thumbnails/_DSC5204-1.jpg',
    fullImage: '/gallery/_DSC5204-1.jpg'
  },
  {
    id: 15,
    title: 'צימר עם גינה פרטית',
    titleEn: 'Cottage with Private Garden',
    thumbnail: '/gallery/thumbnails/_DSC5207-1.jpg',
    fullImage: '/gallery/_DSC5207-1.jpg'
  },
  {
    id: 16,
    title: 'צימר עם נוף לים',
    titleEn: 'Cottage with Sea View',
    thumbnail: '/gallery/thumbnails/_DSC5212-1.jpg',
    fullImage: '/gallery/_DSC5212-1.jpg'
  },
  {
    id: 17,
    title: 'צימר עם נוף להרים',
    titleEn: 'Cottage with Mountain View',
    thumbnail: '/gallery/thumbnails/_DSC5213-1.jpg',
    fullImage: '/gallery/_DSC5213-1.jpg'
  }
];

const Gallery: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
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
      setIsImageLoading(true);
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < cottages.length - 1) {
      setIsImageLoading(true);
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
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
                    <GalleryImage imageUrl={cottage.thumbnail}>
                      <ImageOverlay>
                        <OverlayIcon>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                          </svg>
                        </OverlayIcon>
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
            style={{ display: currentPage === totalPages - 1 ? 'none' : 'flex' }}
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
              
              <ModalImageContainer>
                {selectedImageIndex !== null && (
                  <>
                    {isImageLoading && <LoadingSpinner />}
                    <ModalImage 
                      key={selectedImageIndex}
                      src={cottages[selectedImageIndex].fullImage} 
                      alt={language === 'he' ? cottages[selectedImageIndex].title : cottages[selectedImageIndex].titleEn}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      style={{ opacity: isImageLoading ? 0 : 1 }}
                    />
                  </>
                )}
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
