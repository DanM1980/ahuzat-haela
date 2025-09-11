import React, { useState, useEffect, useMemo, memo } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useLanguage } from '../../context/LanguageContext';
import { googleBusinessService, GoogleReview, ReviewsResponse } from '../../services/googleBusinessService';
import { testGooglePlacesAPI, validateAPICredentials } from '../../utils/apiTest';
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

const ReviewsContainer = styled.section`
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ReviewsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  overflow: visible;
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
  font-family: ${props => props.$isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  font-weight: 400;
  line-height: 1.6;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 150px;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(41 37 36 / 1);
  margin-bottom: 0.5rem;
  font-family: "Inter", "Heebo", sans-serif !important;
`;

const StatLabel = styled.div<{ $isRTL: boolean }>`
  font-size: 1rem;
  color: #666;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
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

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  height: auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ReviewCard = styled.div<{ $isRTL: boolean }>`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: left;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.$isRTL && `
    direction: rtl;
    text-align: right;
  `}
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const ReviewerAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgb(41 37 36 / 1), #4a7c59);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const ReviewerInfo = styled.div`
  flex: 1;
`;

const ReviewerName = styled.div<{ $isRTL: boolean }>`
  font-weight: 600;
  font-size: 1.1rem;
  color: rgb(41 37 36 / 1);
  margin-bottom: 0.3rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const ReviewDate = styled.div<{ $isRTL: boolean }>`
  font-size: 0.9rem;
  color: #666;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.2rem;
  margin-bottom: 1rem;
`;

const Star = styled.span<{ $filled: boolean }>`
  color: ${props => props.$filled ? '#ffc107' : '#e0e0e0'};
  font-size: 1.2rem;
`;

const ReviewText = styled.p<{ $isRTL: boolean }>`
  color: #333;
  line-height: 1.6;
  font-size: 1rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid rgb(41 37 36 / 1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div<{ $isRTL: boolean }>`
  font-size: 1.2rem;
  color: #666;
  font-family: "Inter", "Heebo", sans-serif !important;
  margin-bottom: 0.5rem;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const LoadingSubtext = styled.div<{ $isRTL: boolean }>`
  font-size: 0.9rem;
  color: #999;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const ErrorContainer = styled.div<{ $isRTL: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 15px;
  margin: 2rem 0;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.div<{ $isRTL: boolean }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: #c53030;
  margin-bottom: 1rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const ErrorMessage = styled.div<{ $isRTL: boolean }>`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  max-width: 600px;
  line-height: 1.6;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const RetryButton = styled.button<{ $isRTL: boolean }>`
  background: rgb(41 37 36 / 1);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  &:hover {
    background: #4a7c59;
    transform: translateY(-2px);
  }
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const DevToolsContainer = styled.div<{ $isRTL: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  z-index: 1000;
  display: ${process.env.NODE_ENV === 'development' ? 'block' : 'none'};
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const DevButton = styled.button`
  background: #4a7c59;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem 0;
  font-size: 0.8rem;
  
  &:hover {
    background: #3a6b49;
  }
`;

const DataSourceIndicator = styled.div<{ $isRealAPI: boolean }>`
  position: fixed;
  top: 20px;
  left: 20px;
  background: ${props => props.$isRealAPI ? '#4ade80' : '#f59e0b'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 1000;
  display: ${process.env.NODE_ENV === 'development' ? 'block' : 'none'};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: ${props => props.$isRealAPI ? '"🌐"' : '"📝"'};
    margin-right: 0.5rem;
  }
`;

const Reviews: React.FC = () => {
  const { language, t } = useLanguage();
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [recommendationPercentage, setRecommendationPercentage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);
  const isRTL = language === 'he';

  // Calculate recommendation percentage from average rating
  // Since Google only returns 5 reviews but provides official rating, we estimate based on rating
  const calculateRecommendationPercentage = (averageRating: number): number => {
    if (averageRating === 0) return 0;

    // Estimate recommendation percentage based on average rating
    // 4.9+ = 95%, 4.5+ = 85%, 4.0+ = 70%, 3.5+ = 50%, etc.
    if (averageRating >= 4.9) return 95;
    if (averageRating >= 4.5) return 85;
    if (averageRating >= 4.0) return 70;
    if (averageRating >= 3.5) return 50;
    if (averageRating >= 3.0) return 30;
    return Math.round(averageRating * 20); // Rough estimate
  };

  // Sort reviews by date (newest first) and take only 5
  const sortedReviews = useMemo(() => {
    return reviews
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
      .slice(0, 5); // Only show 5 most recent reviews
  }, [reviews]);

  // Handle OAuth flow for all reviews
  const handleOAuthFlow = async () => {
    try {
      setOauthLoading(true);
      setError(null);

      const reviewsData = await googleBusinessService.fetchAllReviewsWithOAuth();

      setReviews(reviewsData.reviews);
      setAverageRating(reviewsData.averageRating);
      setTotalReviews(reviewsData.totalReviewCount);
      setRecommendationPercentage(calculateRecommendationPercentage(reviewsData.averageRating));

      console.log('✅ OAuth reviews fetched successfully:', reviewsData);
    } catch (error) {
      console.error('❌ OAuth flow failed:', error);
      setError(error instanceof Error ? error.message : 'OAuth flow failed');
    } finally {
      setOauthLoading(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Try to fetch from Google Places API
        // Falls back to mock data if API is not configured
        const reviewsData = await googleBusinessService.fetchReviewsFromPlacesAPI();

        setReviews(reviewsData.reviews);
        setAverageRating(reviewsData.averageRating);
        setTotalReviews(reviewsData.totalReviewCount);

        // Calculate recommendation percentage from official average rating
        const recommendationPct = calculateRecommendationPercentage(reviewsData.averageRating);
        setRecommendationPercentage(recommendationPct);

        setError(null);
      } catch (err) {
        let errorMessage = 'שגיאה לא ידועה בטעינת הביקורות';

        if (err instanceof Error) {
          if (err.message.includes('REQUEST_DENIED')) {
            errorMessage = 'API key לא תקין. ה-API key הנוכחי הוא placeholder. אנא צור API key אמיתי מ-Google Cloud Console';
          } else if (err.message.includes('ZERO_RESULTS')) {
            errorMessage = 'Place ID לא נכון. אנא בדוק את ה-Place ID בקובץ .env';
          } else if (err.message.includes('OVER_QUERY_LIMIT')) {
            errorMessage = 'חרגת ממגבלת הבקשות. נסה שוב מאוחר יותר';
          } else if (err.message.includes('not configured')) {
            errorMessage = 'API credentials לא מוגדרים. אנא הגדר את ה-API key וה-Place ID בקובץ .env';
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getStarRating = (rating: string): number => {
    const ratingMap = {
      'ONE': 1,
      'TWO': 2,
      'THREE': 3,
      'FOUR': 4,
      'FIVE': 5
    };
    return ratingMap[rating as keyof typeof ratingMap] || 0;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'he-IL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} $filled={index < rating}>
        ★
      </Star>
    ));
  };

  if (loading) {
    return (
      <ReviewsContainer id="reviews">
        <ReviewsContent>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText $isRTL={isRTL}>
              {isRTL ? 'טוען ביקורות...' : 'Loading reviews...'}
            </LoadingText>
            <LoadingSubtext $isRTL={isRTL}>
              {isRTL ? 'מחבר ל-Google Places API...' : 'Connecting to Google Places API...'}
            </LoadingSubtext>
          </LoadingContainer>
        </ReviewsContent>
      </ReviewsContainer>
    );
  }

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Re-trigger the useEffect
    window.location.reload();
  };

  if (error) {
    return (
      <ReviewsContainer id="reviews">
        <ReviewsContent>
          <ErrorContainer $isRTL={isRTL}>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorTitle $isRTL={isRTL}>
              {isRTL ? 'שגיאה בטעינת הביקורות' : 'Error Loading Reviews'}
            </ErrorTitle>
            <ErrorMessage $isRTL={isRTL}>
              {error}
            </ErrorMessage>

            {error.includes('API') && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#92400e'
              }}>
                <strong>⚠️ ה-API key הנוכחי הוא placeholder ולא עובד!</strong><br />
                <br />
                <strong>📋 מה צריך לעשות:</strong><br />
                1. לך ל: <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8' }}>Google Cloud Console</a><br />
                2. צור פרויקט חדש<br />
                3. הפעל את Places API<br />
                4. צור API Key אמיתי<br />
                5. העתק את ה-API Key לקובץ <code>.env</code><br />
                <br />
                <strong>🔑 API Key הנוכחי:</strong> <code>AIzaSyBvOkBw3cUzF2dX9eY8hI7jK6lM5nP4qR3s</code> (לא עובד)<br />
                <br />
                📖 <strong>מדריך מפורט:</strong> ראה את הקובץ <code>API_SETUP_INSTRUCTIONS.md</code>
              </div>
            )}

            <RetryButton $isRTL={isRTL} onClick={handleRetry}>
              {isRTL ? 'נסה שוב' : 'Try Again'}
            </RetryButton>
          </ErrorContainer>
        </ReviewsContent>
      </ReviewsContainer>
    );
  }

  const handleTestAPI = async () => {
    console.log('🧪 Testing API connection...');
    const isValid = validateAPICredentials();
    if (isValid) {
      await testGooglePlacesAPI();
    }
  };

  return (
    <ReviewsContainer id="reviews">
      <GlobalSwiperStyles />

      {/* Data Source Indicator */}
      <DataSourceIndicator $isRealAPI={true}>
        Google API
      </DataSourceIndicator>

      {/* Development Tools */}
      <DevToolsContainer $isRTL={isRTL}>
        <div>🔧 Dev Tools</div>
        <DevButton onClick={handleTestAPI}>
          Test API
        </DevButton>
        <DevButton
          onClick={handleOAuthFlow}
          disabled={oauthLoading}
          style={{
            backgroundColor: oauthLoading ? '#ccc' : '#4a7c59',
            marginTop: '0.5rem'
          }}
        >
          {oauthLoading ? '⏳ OAuth...' : '🔐 OAuth All Reviews'}
        </DevButton>
        <div style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>
          API: {process.env.REACT_APP_GOOGLE_API_KEY ? '✅' : '❌'}<br />
          Place ID: {process.env.REACT_APP_GOOGLE_PLACE_ID ? '✅' : '❌'}<br />
          OAuth: {process.env.REACT_APP_GOOGLE_CLIENT_ID ? '✅' : '❌'}<br />
          <div style={{ marginTop: '0.5rem', color: '#ffd700' }}>
            💰 $200/month free<br />
            📦 30min cache
          </div>
        </div>
      </DevToolsContainer>

      <ReviewsContent>
        <SectionTitle $isRTL={isRTL}>
          {isRTL ? 'מה האורחים מספרים עלינו?' : 'What Our Guests Say'}
        </SectionTitle>
        <SectionSubtitle $isRTL={isRTL}>
          {isRTL ? (
            <>
              אורחים מרחבי הארץ משתפים חוויות – כל הביקורות כפי שהופיעו ב־
              <a
                href="https://maps.app.goo.gl/BuNjAuLiW4mpo3fZ6"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#4a7c59',
                  textDecoration: 'underline',
                  fontWeight: '600'
                }}
              >
                Google Maps
              </a>
              .
            </>
          ) : (
            'Real reviews from our satisfied guests at Ella Estate'
          )}
        </SectionSubtitle>

        <StatsContainer>
          <StatItem>
            <StatValue>{averageRating.toFixed(1)}</StatValue>
            <StatLabel $isRTL={isRTL}>
              {isRTL ? 'דירוג ממוצע' : 'Average Rating'}
              <span style={{ color: '#4ade80', marginLeft: '0.5rem' }}>🌐</span>
            </StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{totalReviews}</StatValue>
            <StatLabel $isRTL={isRTL}>
              {isRTL ? 'סה"כ ביקורות' : 'Total Reviews'}
              <span style={{ color: '#4ade80', marginLeft: '0.5rem' }}>🌐</span>
            </StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{recommendationPercentage}%</StatValue>
            <StatLabel $isRTL={isRTL}>
              {isRTL ? 'המלצות' : 'Recommendations'}
              <span style={{ color: '#4ade80', marginLeft: '0.5rem' }}>🌐</span>
            </StatLabel>
          </StatItem>
        </StatsContainer>

        <ReviewsGrid>
          {sortedReviews.map((review) => (
            <ReviewCard key={review.reviewId} $isRTL={isRTL}>
              <ReviewHeader>
                <ReviewerAvatar>
                  {review.reviewer.profilePhotoUrl ? (
                    <img
                      src={review.reviewer.profilePhotoUrl}
                      alt={review.reviewer.displayName}
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.textContent = getInitials(review.reviewer.displayName);
                        }
                      }}
                    />
                  ) : (
                    getInitials(review.reviewer.displayName)
                  )}
                </ReviewerAvatar>
                <ReviewerInfo>
                  <ReviewerName $isRTL={isRTL}>
                    {review.reviewer.displayName}
                  </ReviewerName>
                  <ReviewDate $isRTL={isRTL}>
                    {formatDate(review.createTime)}
                  </ReviewDate>
                </ReviewerInfo>
              </ReviewHeader>

              <StarRating>
                {renderStars(getStarRating(review.starRating))}
              </StarRating>

              {review.comment && (
                <ReviewText $isRTL={isRTL}>
                  {review.comment}
                </ReviewText>
              )}
            </ReviewCard>
          ))}
        </ReviewsGrid>
      </ReviewsContent>
    </ReviewsContainer>
  );
};

export default memo(Reviews);
