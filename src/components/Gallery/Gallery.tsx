import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useLanguage } from '../../context/LanguageContext';
import { preloadImage } from '../../utils/imageOptimization';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Global CSS to ensure navigation buttons are visible
const GlobalSwiperStyles = styled.div`
  .swiper-button-next,
  .swiper-button-prev {
    display: flex !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
`;

const GallerySection = styled.section`
  padding: 5rem 0;
  background: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  overflow: visible;
`;

const SectionTitle = styled.h2<{ isRTL: boolean }>`
  text-align: center;
  font-size: 2.5rem;
  color: rgb(41 37 36 / 1);
  margin-bottom: 1rem;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  font-weight: 600;
  letter-spacing: -0.02em;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const SectionSubtitle = styled.p<{ isRTL: boolean }>`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  font-family: ${props => props.isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  font-weight: 400;
  line-height: 1.6;
  
  ${props => props.isRTL && `
    direction: rtl;
  `}
`;

const SwiperContainer = styled.div`
  position: relative;
  margin-bottom: 3rem;
  padding: 0 6rem;
  overflow: visible;
  
  .swiper {
    padding: 0;
    overflow: visible;
  }
  
  /* Force navigation buttons to be visible */
  .swiper-button-next,
  .swiper-button-prev {
    display: flex !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  .swiper-slide {
    height: auto;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    &.swiper-slide-active {
      opacity: 1;
    }
  }
  
  .swiper-wrapper {
    align-items: stretch;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: rgb(41 37 36 / 1) !important;
    background: rgba(255, 255, 255, 0.9) !important;
    width: 50px !important;
    height: 50px !important;
    border-radius: 50% !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease !important;
    z-index: 100 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    
    &:after {
      font-size: 18px !important;
      font-weight: bold !important;
    }
    
    &:hover {
      background: rgba(255, 255, 255, 1) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
    }
  }
  
  .swiper-button-next {
    right: -60px;
  }
  
  .swiper-button-prev {
    left: -60px;
  }
  
  .swiper-button-disabled {
    opacity: 0.3 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
    background: rgba(200, 200, 200, 0.5) !important;
    color: #999 !important;
    
    &:hover {
      background: rgba(200, 200, 200, 0.5) !important;
      transform: none !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
    }
  }
  
  
  .swiper-pagination {
    bottom: -3rem;
  }
  
  .swiper-pagination-bullet {
    background: #ccc;
    opacity: 1;
    width: 12px;
    height: 12px;
    margin: 0 4px;
    transition: background-color 0.3s ease;
    
    &.swiper-pagination-bullet-active {
      background: rgb(41 37 36 / 1);
    }
    
    &:hover {
      background: #4a7c59;
    }
  }
  
  @media (max-width: 768px) {
    padding: 0 3rem;
    
    .swiper-button-next,
    .swiper-button-prev {
      width: 40px;
      height: 40px;
      
      &:after {
        font-size: 14px;
      }
    }
    
    .swiper-button-next {
      right: -50px;
    }
    
    .swiper-button-prev {
      left: -50px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0 2rem;
    
    .swiper-button-next {
      right: -40px;
    }
    
    .swiper-button-prev {
      left: -40px;
    }
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
  height: 500px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    height: 600px;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    height: 500px;
    gap: 1rem;
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
  width: 100%;
  height: 100%;
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
    background: linear-gradient(45deg, rgba(202, 138, 4, 0.4), rgba(255, 215, 0, 0.4));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${GalleryItem}:hover &::before {
    opacity: 1;
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


const LightboxModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LightboxImage = styled.img`
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
  font-family: "Inter", "Heebo", sans-serif !important;
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
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: rgb(41 37 36 / 1);
  font-size: 2rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2001;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: translateY(-50%);
    background: rgba(200, 200, 200, 0.5);
    color: #999;
    
    &:hover {
      transform: translateY(-50%);
      background: rgba(200, 200, 200, 0.5);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
    title: 'יחידת אירוח משפחתית',
    titleEn: 'Family Cottage',
    thumbnail: '/images/gallery/thumbnails/_DSC5126-1.jpg',
    fullImage: '/images/gallery/_DSC5126-1.jpg'
  },
  {
    id: 2,
    title: 'יחידת אירוח זוגית רומנטית',
    titleEn: 'Romantic Couple Cottage',
    thumbnail: '/images/gallery/thumbnails/_DSC5139-HDR-1.jpg',
    fullImage: '/images/gallery/_DSC5139-HDR-1.jpg'
  },
  {
    id: 3,
    title: 'יחידת אירוח לקבוצות',
    titleEn: 'Group Cottage',
    thumbnail: '/images/gallery/thumbnails/_DSC5143-1.jpg',
    fullImage: '/images/gallery/_DSC5143-1.jpg'
  },
  {
    id: 4,
    title: 'יחידת אירוח עם נוף',
    titleEn: 'Scenic View Cottage',
    thumbnail: '/gallery/thumbnails/_DSC5145-2.jpg',
    fullImage: '/gallery/_DSC5145-2.jpg'
  },
  {
    id: 5,
    title: 'יחידת אירוח ליד הים',
    titleEn: 'Beachside Cottage',
    thumbnail: '/gallery/thumbnails/_DSC5146-1.jpg',
    fullImage: '/gallery/_DSC5146-1.jpg'
  },
  {
    id: 6,
    title: 'יחידת אירוח כפרית',
    titleEn: 'Country Cottage',
    thumbnail: '/gallery/thumbnails/_DSC5152-HDR-1.jpg',
    fullImage: '/gallery/_DSC5152-HDR-1.jpg'
  },
  {
    id: 7,
    title: 'יחידת אירוח עם בריכה',
    titleEn: 'Cottage with Pool',
    thumbnail: '/gallery/thumbnails/_DSC5159-1.jpg',
    fullImage: '/gallery/_DSC5159-1.jpg'
  },
  {
    id: 8,
    title: 'יחידת אירוח עם ג\'קוזי',
    titleEn: 'Cottage with Jacuzzi',
    thumbnail: '/gallery/thumbnails/_DSC5160-2.jpg',
    fullImage: '/gallery/_DSC5160-2.jpg'
  },
  {
    id: 9,
    title: 'יחידת אירוח עם מרפסת',
    titleEn: 'Cottage with Balcony',
    thumbnail: '/gallery/thumbnails/_DSC5164-1.jpg',
    fullImage: '/gallery/_DSC5164-1.jpg'
  },
  {
    id: 10,
    title: 'יחידת אירוח עם גינה',
    titleEn: 'Cottage with Garden',
    thumbnail: '/gallery/thumbnails/_DSC5167-1.jpg',
    fullImage: '/gallery/_DSC5167-1.jpg'
  },
  {
    id: 11,
    title: 'יחידת אירוח עם ברביקיו',
    titleEn: 'Cottage with BBQ',
    thumbnail: '/gallery/thumbnails/_DSC5188-HDR-1.jpg',
    fullImage: '/gallery/_DSC5188-HDR-1.jpg'
  },
  {
    id: 12,
    title: 'יחידת אירוח עם נוף הרים',
    titleEn: 'Cottage with Mountain View',
    thumbnail: '/gallery/thumbnails/_DSC5201-1.jpg',
    fullImage: '/gallery/_DSC5201-1.jpg'
  },
  {
    id: 13,
    title: 'יחידת אירוח עם נוף פנורמי',
    titleEn: 'Cottage with Panoramic View',
    thumbnail: '/gallery/thumbnails/_DSC5203-1.jpg',
    fullImage: '/gallery/_DSC5203-1.jpg'
  },
  {
    id: 14,
    title: 'יחידת אירוח עם מרפסת פרטית',
    titleEn: 'Cottage with Private Balcony',
    thumbnail: '/gallery/thumbnails/_DSC5204-1.jpg',
    fullImage: '/gallery/_DSC5204-1.jpg'
  },
  {
    id: 15,
    title: 'יחידת אירוח עם גינה פרטית',
    titleEn: 'Cottage with Private Garden',
    thumbnail: '/gallery/thumbnails/_DSC5207-1.jpg',
    fullImage: '/gallery/_DSC5207-1.jpg'
  },
  {
    id: 16,
    title: 'יחידת אירוח עם נוף לים',
    titleEn: 'Cottage with Sea View',
    thumbnail: '/gallery/thumbnails/_DSC5212-1.jpg',
    fullImage: '/gallery/_DSC5212-1.jpg'
  },
  {
    id: 17,
    title: 'יחידת אירוח עם נוף להרים',
    titleEn: 'Cottage with Mountain View',
    thumbnail: '/gallery/thumbnails/_DSC5213-1.jpg',
    fullImage: '/gallery/_DSC5213-1.jpg'
  }
];

const Gallery: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const isRTL = language === 'he';

  // Create groups of 6 images
  const imagesPerSlide = 6;
  const imageGroups = [];
  for (let i = 0; i < cottages.length; i += imagesPerSlide) {
    imageGroups.push(cottages.slice(i, i + imagesPerSlide));
  }

  const openLightbox = useCallback(async (imageIndex: number) => {
    // Preload the full-size image before opening lightbox
    try {
      await preloadImage(cottages[imageIndex].fullImage);
    } catch (error) {
      console.warn('Failed to preload image:', error);
    }
    setSelectedImageIndex(imageIndex);
  }, []);

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = React.useCallback(() => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setIsImageLoading(true);
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  }, [selectedImageIndex]);

  const goToNext = React.useCallback(() => {
    if (selectedImageIndex !== null && selectedImageIndex < cottages.length - 1) {
      setIsImageLoading(true);
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  }, [selectedImageIndex]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
  };

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (selectedImageIndex !== null) {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    }
  }, [selectedImageIndex, goToPrevious, goToNext]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <GallerySection id="gallery">
      <GlobalSwiperStyles />
      <Container>
        <SectionTitle isRTL={isRTL}>{t('gallery.title')}</SectionTitle>
        <SectionSubtitle isRTL={isRTL}>{t('gallery.subtitle')}</SectionSubtitle>
        
        <SwiperContainer>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            loop={false}
            speed={500}
            centeredSlides={false}
            watchSlidesProgress={true}
          >
            {imageGroups.map((group, groupIndex) => (
              <SwiperSlide key={groupIndex}>
                <GalleryGrid>
                  {group.map((cottage, index) => {
                    const globalIndex = groupIndex * imagesPerSlide + index;
                    return (
                      <GalleryItem key={cottage.id} onClick={() => openLightbox(globalIndex)}>
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
                    );
                  })}
                </GalleryGrid>
              </SwiperSlide>
            ))}
          </Swiper>
        </SwiperContainer>
      </Container>
      
      <LightboxModal isOpen={selectedImageIndex !== null} onClick={closeLightbox}>
        <LightboxContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={closeLightbox}>×</CloseButton>
          
          {selectedImageIndex !== null && (
            <>
              <PrevButton 
                onClick={goToPrevious} 
                disabled={selectedImageIndex === 0}
              >
                ‹
              </PrevButton>
              
              <LightboxImage 
                key={selectedImageIndex}
                src={cottages[selectedImageIndex].fullImage} 
                alt={isRTL ? cottages[selectedImageIndex].title : cottages[selectedImageIndex].titleEn}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ opacity: isImageLoading ? 0 : 1 }}
              />
              
              {isImageLoading && <LoadingSpinner />}
              
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
        </LightboxContent>
      </LightboxModal>
    </GallerySection>
  );
};

export default Gallery;




