import React, { useState, useEffect, useMemo, memo } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useLanguage } from '../../context/LanguageContext';
import { googleBusinessOAuthService, GoogleBusinessReview, GoogleBusinessReviewsResponse } from '../../services/googleBusinessOAuthService';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Global CSS for Swiper
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
  min-height: 100vh;
`;

const ReviewsContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  overflow: visible;
`;

const SectionTitle = styled.h2<{ $isRTL: boolean }>`
  text-align: center;
  font-size: 3rem;
  color: rgb(41 37 36 / 1);
  margin-bottom: 1rem;
  font-family: ${props => props.$isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  font-weight: 700;
  letter-spacing: -0.02em;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled.p<{ $isRTL: boolean }>`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
  font-family: ${props => props.$isRTL ? '"Heebo", sans-serif' : '"Inter", sans-serif'} !important;
  font-weight: 400;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: rgb(41 37 36 / 1);
  margin-bottom: 0.5rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div<{ $isRTL: boolean }>`
  font-size: 1.1rem;
  color: #666;
  font-family: "Inter", "Heebo", sans-serif !important;
  font-weight: 600;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ReviewCard = styled.div<{ $isRTL: boolean }>`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.$isRTL && `
    direction: rtl;
    text-align: right;
  `}
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const ReviewerAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.4rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const ReviewerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ReviewerName = styled.div<{ $isRTL: boolean }>`
  font-weight: 700;
  font-size: 1.2rem;
  color: rgb(41 37 36 / 1);
  margin-bottom: 0.5rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const ReviewDate = styled.div<{ $isRTL: boolean }>`
  font-size: 0.9rem;
  color: #888;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.3rem;
  margin-bottom: 1.5rem;
`;

const Star = styled.span<{ $filled: boolean }>`
  color: ${props => props.$filled ? '#ffc107' : '#e0e0e0'};
  font-size: 1.4rem;
  transition: color 0.2s ease;
`;

const ReviewText = styled.p<{ $isRTL: boolean }>`
  color: #333;
  line-height: 1.7;
  font-size: 1.1rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  margin-bottom: 1rem;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const ReviewReply = styled.div<{ $isRTL: boolean }>`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border-left: 4px solid #667eea;
  
  ${props => props.$isRTL && `
    direction: rtl;
    border-left: none;
    border-right: 4px solid #667eea;
  `}
`;

const ReplyHeader = styled.div<{ $isRTL: boolean }>`
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const ReplyText = styled.div<{ $isRTL: boolean }>`
  color: #555;
  line-height: 1.6;
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
  min-height: 500px;
  padding: 2rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 2rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div<{ $isRTL: boolean }>`
  font-size: 1.4rem;
  color: #666;
  font-family: "Inter", "Heebo", sans-serif !important;
  margin-bottom: 1rem;
  font-weight: 600;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const LoadingSubtext = styled.div<{ $isRTL: boolean }>`
  font-size: 1rem;
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
  min-height: 500px;
  padding: 2rem;
  text-align: center;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 20px;
  margin: 2rem 0;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const ErrorTitle = styled.div<{ $isRTL: boolean }>`
  font-size: 1.8rem;
  font-weight: 700;
  color: #c53030;
  margin-bottom: 1rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const ErrorMessage = styled.div<{ $isRTL: boolean }>`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const RetryButton = styled.button<{ $isRTL: boolean }>`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", "Heebo", sans-serif !important;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const OAuthButton = styled.button<{ $isRTL: boolean; $loading: boolean }>`
  background: ${props => props.$loading
    ? 'linear-gradient(135deg, #ccc 0%, #999 100%)'
    : 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)'
  };
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  font-family: "Inter", "Heebo", sans-serif !important;
  margin: 2rem auto;
  display: block;
  box-shadow: 0 8px 30px rgba(66, 133, 244, 0.3);
  
  &:hover {
    transform: ${props => props.$loading ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.$loading
    ? '0 8px 30px rgba(66, 133, 244, 0.3)'
    : '0 12px 40px rgba(66, 133, 244, 0.4)'
  };
  }
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const ReviewsCount = styled.div<{ $isRTL: boolean }>`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  font-family: "Inter", "Heebo", sans-serif !important;
  font-weight: 600;
  
  ${props => props.$isRTL && `
    direction: rtl;
  `}
`;

const GoogleBusinessReviews: React.FC = () => {
  const { language, t } = useLanguage();
  const [reviews, setReviews] = useState<GoogleBusinessReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<boolean>(false);
  const isRTL = language === 'he';

  // Calculate recommendation percentage from average rating
  const calculateRecommendationPercentage = (averageRating: number): number => {
    if (averageRating === 0) return 0;
    if (averageRating >= 4.9) return 95;
    if (averageRating >= 4.5) return 85;
    if (averageRating >= 4.0) return 70;
    if (averageRating >= 3.5) return 50;
    if (averageRating >= 3.0) return 30;
    return Math.round(averageRating * 20);
  };

  // Handle OAuth flow for all reviews
  const handleOAuthFlow = async () => {
    try {
      setOauthLoading(true);
      setError(null);
      setLoading(true);

      console.log('🚀 Starting OAuth flow for Google Business Profile...');
      const reviewsData = await googleBusinessOAuthService.fetchAllReviewsWithOAuth();

      setReviews(reviewsData.reviews);
      setAverageRating(reviewsData.averageRating);
      setTotalReviews(reviewsData.totalReviewCount);

      console.log('✅ OAuth reviews fetched successfully:', {
        totalReviews: reviewsData.totalReviewCount,
        averageRating: reviewsData.averageRating,
        reviewsCount: reviewsData.reviews.length
      });
    } catch (error) {
      console.error('❌ OAuth flow failed:', error);
      setError(error instanceof Error ? error.message : 'OAuth flow failed');
    } finally {
      setOauthLoading(false);
      setLoading(false);
    }
  };

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

  const handleRetry = () => {
    setError(null);
    handleOAuthFlow();
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
              {isRTL ? 'מחבר ל-Google Business Profile...' : 'Connecting to Google Business Profile...'}
            </LoadingSubtext>
          </LoadingContainer>
        </ReviewsContent>
      </ReviewsContainer>
    );
  }

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
            <RetryButton $isRTL={isRTL} onClick={handleRetry}>
              {isRTL ? 'נסה שוב' : 'Try Again'}
            </RetryButton>
          </ErrorContainer>
        </ReviewsContent>
      </ReviewsContainer>
    );
  }

  if (reviews.length === 0) {
    return (
      <ReviewsContainer id="reviews">
        <ReviewsContent>
          <SectionTitle $isRTL={isRTL}>
            {isRTL ? 'מה האורחים מספרים עלינו?' : 'What Our Guests Say'}
          </SectionTitle>
          <SectionSubtitle $isRTL={isRTL}>
            {isRTL ? 'לחץ על הכפתור למטה כדי לראות את כל הביקורות מ-Google Business Profile' : 'Click the button below to view all reviews from Google Business Profile'}
          </SectionSubtitle>
          <OAuthButton $isRTL={isRTL} $loading={oauthLoading} onClick={handleOAuthFlow} disabled={oauthLoading}>
            {oauthLoading ? '⏳ מתחבר...' : '🔐 הצג כל הביקורות מ-Google Business Profile'}
          </OAuthButton>
        </ReviewsContent>
      </ReviewsContainer>
    );
  }

  const recommendationPercentage = calculateRecommendationPercentage(averageRating);

  return (
    <ReviewsContainer id="reviews">
      <GlobalSwiperStyles />

      <ReviewsContent>
        <SectionTitle $isRTL={isRTL}>
          {isRTL ? 'מה האורחים מספרים עלינו?' : 'What Our Guests Say'}
        </SectionTitle>
        <SectionSubtitle $isRTL={isRTL}>
          {isRTL ? (
            <>
              כל הביקורות מ-
              <a
                href="https://business.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#667eea',
                  textDecoration: 'underline',
                  fontWeight: '600'
                }}
              >
                Google Business Profile
              </a>
              - ממוינות מהחדש לישן
            </>
          ) : (
            'All reviews from Google Business Profile - sorted from newest to oldest'
          )}
        </SectionSubtitle>

        <StatsContainer>
          <StatItem>
            <StatValue>{averageRating.toFixed(1)}</StatValue>
            <StatLabel $isRTL={isRTL}>
              {isRTL ? 'דירוג ממוצע' : 'Average Rating'}
            </StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{totalReviews}</StatValue>
            <StatLabel $isRTL={isRTL}>
              {isRTL ? 'סה"כ ביקורות' : 'Total Reviews'}
            </StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{recommendationPercentage}%</StatValue>
            <StatLabel $isRTL={isRTL}>
              {isRTL ? 'המלצות' : 'Recommendations'}
            </StatLabel>
          </StatItem>
        </StatsContainer>

        <ReviewsCount $isRTL={isRTL}>
          {isRTL ? `מציג ${reviews.length} מתוך ${totalReviews} ביקורות` : `Showing ${reviews.length} of ${totalReviews} reviews`}
        </ReviewsCount>

        <ReviewsGrid>
          {reviews.map((review) => (
            <ReviewCard key={review.reviewId} $isRTL={isRTL}>
              <ReviewHeader>
                <ReviewerAvatar>
                  {review.reviewer.profilePhotoUrl ? (
                    <img
                      src={review.reviewer.profilePhotoUrl}
                      alt={review.reviewer.displayName}
                      onError={(e) => {
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

              {review.reviewReply && (
                <ReviewReply $isRTL={isRTL}>
                  <ReplyHeader $isRTL={isRTL}>
                    {isRTL ? 'תגובת העסק:' : 'Business Reply:'}
                  </ReplyHeader>
                  <ReplyText $isRTL={isRTL}>
                    {review.reviewReply.comment}
                  </ReplyText>
                </ReviewReply>
              )}
            </ReviewCard>
          ))}
        </ReviewsGrid>
      </ReviewsContent>
    </ReviewsContainer>
  );
};

export default memo(GoogleBusinessReviews);
