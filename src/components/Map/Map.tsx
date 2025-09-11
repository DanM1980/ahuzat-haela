import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useLanguage } from '../../context/LanguageContext';
import attractionsData from '../../data/attractions.json';

// Types
interface Attraction {
  id: string;
  category: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  icon: string;
  difficulty?: string;
  duration?: string;
  cuisine?: string;
  priceRange?: string;
  type?: string;
  ageGroup?: string;
  image: string;
  link: string;
  phone: string;
}

interface MapComponentProps {
  center: { lat: number; lng: number };
  zoom: number;
  attractions: Attraction[];
  selectedCategory: string | null;
  onAttractionClick: (attraction: Attraction) => void;
}

// Styled Components
const MapContainer = styled.section`
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MapContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
`;

const SectionTitle = styled.h2<{ $isRTL: boolean }>`
  text-align: center;
  font-size: 2.5rem;
  color: rgb(41 37 36 / 1);
  margin-bottom: 1rem;
  font-family: ${props => props.$isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  font-weight: 600;
  letter-spacing: -0.02em;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const SectionSubtitle = styled.p<{ $isRTL: boolean }>`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
  position: relative;
`;

const Legend = styled.div<{ $isRTL: boolean }>`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const LegendItem = styled.div<{ $isActive: boolean; $isRTL: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.$isActive ? '#4a7c59' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#333'};
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$isActive ? '#4a7c59' : '#e9ecef'};
  font-weight: 500;
  
  &:hover {
    background: ${props => props.$isActive ? '#3d6b4a' : '#f8f9fa'};
    transform: translateY(-2px);
  }
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;


const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: #f8f9fa;
  border-radius: 15px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #4a7c59;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #666;
  font-size: 1.1rem;
`;

// Google Maps Component
const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom,
  attractions,
  selectedCategory,
  onAttractionClick
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (map && window.google && window.google.maps) {
      try {
        // Clear existing markers
        markers.forEach(marker => {
          if (marker && marker.map) {
            marker.map = null;
          }
        });

        // Create InfoWindow if it doesn't exist
        if (!infoWindow) {
          const newInfoWindow = new window.google.maps.InfoWindow();
          setInfoWindow(newInfoWindow);
        }

        // Filter attractions by selected category
        const filteredAttractions = selectedCategory
          ? attractions.filter(attraction => attraction.category === selectedCategory)
          : attractions;

        // Create new markers
        const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

        filteredAttractions.forEach(attraction => {
          try {
            // Create marker element with SVG icon
            const markerElement = document.createElement('div');
            markerElement.innerHTML = `
              <div style="
                width: 40px;
                height: 40px;
                background: #4a7c59;
                border: 2px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: pointer;
              ">
                ${attraction.icon}
              </div>
            `;

            const marker = new window.google.maps.marker.AdvancedMarkerElement({
              position: { lat: attraction.lat, lng: attraction.lng },
              map: map,
              title: attraction.name,
              content: markerElement
            });

            marker.addListener('click', () => {
              if (infoWindow) {
                // Create InfoWindow content
                const content = `
                  <div style="
                    font-family: 'Inter', 'Heebo', sans-serif;
                    max-width: 300px;
                    padding: 0;
                    direction: ${attraction.name.includes('א') ? 'rtl' : 'ltr'};
                  ">
                    <div style="
                      background: linear-gradient(135deg, #4a7c59 0%, #3d6b4a 100%);
                      color: white;
                      padding: 1rem;
                      border-radius: 12px 12px 0 0;
                      text-align: center;
                      position: relative;
                    ">
                      <button onclick="this.closest('.gm-style-iw').parentElement.click()" style="
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background 0.3s ease;
                      " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                      <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${attraction.icon}</div>
                      <h3 style="margin: 0; font-size: 1.1rem; font-weight: 600;">${attraction.name}</h3>
                      <div style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        padding: 0.25rem 0.75rem;
                        border-radius: 15px;
                        font-size: 0.8rem;
                        font-weight: 500;
                        display: inline-block;
                        margin-top: 0.5rem;
                      ">${attraction.category}</div>
                    </div>
                    
                    <div style="padding: 1rem; background: white; border-radius: 0 0 12px 12px;">
                      <p style="
                        color: #666;
                        line-height: 1.5;
                        margin: 0 0 1rem 0;
                        font-size: 0.9rem;
                      ">${attraction.description}</p>
                      
                      ${attraction.difficulty ? `
                        <div style="
                          background: #f8f9fa;
                          color: #666;
                          padding: 0.25rem 0.5rem;
                          border-radius: 10px;
                          font-size: 0.8rem;
                          display: inline-block;
                          margin: 0.25rem 0.25rem 0.25rem 0;
                        ">${attraction.name.includes('א') ? 'רמת קושי' : 'Difficulty'}: ${attraction.difficulty}</div>
                      ` : ''}
                      
                      ${attraction.duration ? `
                        <div style="
                          background: #f8f9fa;
                          color: #666;
                          padding: 0.25rem 0.5rem;
                          border-radius: 10px;
                          font-size: 0.8rem;
                          display: inline-block;
                          margin: 0.25rem 0.25rem 0.25rem 0;
                        ">${attraction.name.includes('א') ? 'משך' : 'Duration'}: ${attraction.duration}</div>
                      ` : ''}
                      
                      ${attraction.cuisine ? `
                        <div style="
                          background: #f8f9fa;
                          color: #666;
                          padding: 0.25rem 0.5rem;
                          border-radius: 10px;
                          font-size: 0.8rem;
                          display: inline-block;
                          margin: 0.25rem 0.25rem 0.25rem 0;
                        ">${attraction.name.includes('א') ? 'מטבח' : 'Cuisine'}: ${attraction.cuisine}</div>
                      ` : ''}
                      
                      <div style="
                        display: flex;
                        gap: 0.5rem;
                        margin-top: 1rem;
                        flex-wrap: wrap;
                      ">
                        <a href="${attraction.link}" target="_blank" rel="noopener noreferrer" style="
                          background: #4a7c59;
                          color: white;
                          padding: 0.5rem 1rem;
                          border-radius: 8px;
                          text-decoration: none;
                          font-size: 0.9rem;
                          font-weight: 500;
                          transition: all 0.3s ease;
                          display: inline-block;
                        " onmouseover="this.style.background='#3d6b4a'" onmouseout="this.style.background='#4a7c59'">
                          ${attraction.name.includes('א') ? 'מידע נוסף' : 'More Info'}
                        </a>
                        <a href="tel:${attraction.phone}" style="
                          background: #28a745;
                          color: white;
                          padding: 0.5rem 1rem;
                          border-radius: 8px;
                          text-decoration: none;
                          font-size: 0.9rem;
                          font-weight: 500;
                          transition: all 0.3s ease;
                          display: inline-block;
                        " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
                          ${attraction.name.includes('א') ? 'התקשר' : 'Call'}
                        </a>
                      </div>
                    </div>
                  </div>
                `;

                infoWindow.setContent(content);
                infoWindow.open(map, marker);
              }
              onAttractionClick(attraction);
            });

            newMarkers.push(marker);
          } catch (error) {
            console.error('Error creating marker for attraction:', attraction.name, error);
          }
        });

        setMarkers(newMarkers);
      } catch (error) {
        console.error('Error updating map markers:', error);
      }
    }
  }, [map, attractions, selectedCategory, onAttractionClick, infoWindow]);

  return (
    <div
      ref={(node) => {
        if (node && !map && window.google && window.google.maps) {
          try {
            const newMap = new window.google.maps.Map(node, {
              center,
              zoom,
              mapId: 'DEMO_MAP_ID' // Required for AdvancedMarkerElement
            });

            // Add click listener to close InfoWindow when clicking on map
            newMap.addListener('click', () => {
              if (infoWindow) {
                infoWindow.close();
              }
            });

            setMap(newMap);
          } catch (error) {
            console.error('Error creating map:', error);
          }
        }
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Main Map Component
const Map: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isRTL = language === 'he';

  const { center, attractions } = attractionsData;

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(attractions.map(attraction => attraction.category)));
    return uniqueCategories;
  }, [attractions]);

  const handleAttractionClick = (attraction: Attraction) => {
    // This function is called when an attraction is clicked on the map
    // Could be used for analytics or other tracking in the future
  };

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <LoadingContainer>
            <div style={{ textAlign: 'center' }}>
              <LoadingSpinner />
              <LoadingText>{isRTL ? 'טוען מפה...' : 'Loading map...'}</LoadingText>
            </div>
          </LoadingContainer>
        );
      case Status.FAILURE:
        return (
          <LoadingContainer>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#e74c3c', fontSize: '1.1rem', marginBottom: '1rem' }}>
                {isRTL ? 'שגיאה בטעינת המפה' : 'Error loading map'}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                {isRTL ? 'אנא בדוק את חיבור האינטרנט או נסה שוב מאוחר יותר' : 'Please check your internet connection or try again later'}
              </p>
            </div>
          </LoadingContainer>
        );
      case Status.SUCCESS:
        return (
          <MapComponent
            center={center}
            zoom={12}
            attractions={attractions}
            selectedCategory={selectedCategory}
            onAttractionClick={handleAttractionClick}
          />
        );
      default:
        return (
          <LoadingContainer>
            <div style={{ textAlign: 'center' }}>
              <LoadingSpinner />
              <LoadingText>{isRTL ? 'טוען מפה...' : 'Loading map...'}</LoadingText>
            </div>
          </LoadingContainer>
        );
    }
  };

  return (
    <MapContainer id="map">
      <MapContent>
        <SectionTitle $isRTL={isRTL}>
          {isRTL ? 'אטרקציות בסביבה' : 'Local Attractions'}
        </SectionTitle>
        <SectionSubtitle $isRTL={isRTL}>
          {isRTL
            ? 'גלו את האטרקציות והמקומות המעניינים סביב אחוזת האלה'
            : 'Discover the attractions and interesting places around Ella Estate'
          }
        </SectionSubtitle>

        <Legend $isRTL={isRTL}>
          <LegendItem
            $isActive={selectedCategory === null}
            $isRTL={isRTL}
            onClick={() => setSelectedCategory(null)}
          >
            <span>🗺️</span>
            <span>{isRTL ? 'הכל' : 'All'}</span>
          </LegendItem>
          {categories.map(category => (
            <LegendItem
              key={category}
              $isActive={selectedCategory === category}
              $isRTL={isRTL}
              onClick={() => setSelectedCategory(category)}
            >
              <span>{attractions.find(a => a.category === category)?.icon}</span>
              <span>{category}</span>
            </LegendItem>
          ))}
        </Legend>

        <MapWrapper>
          <Wrapper
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyCwmNz5zxUwPlT7S1TfX4xXyrpo226X2BE'}
            render={render}
            libraries={['places', 'marker']}
          />
        </MapWrapper>
      </MapContent>
    </MapContainer>
  );
};

export default Map;
