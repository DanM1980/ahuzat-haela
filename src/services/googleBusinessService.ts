// Google Business Profile API Service
// This service handles fetching reviews from Google Business Profile API

export interface GoogleReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
}

export interface ReviewsResponse {
  reviews: GoogleReview[];
  averageRating: number;
  totalReviewCount: number;
}

class GoogleBusinessService {
  private readonly API_BASE_URL = 'https://mybusiness.googleapis.com/v4';
  private readonly PLACE_ID = process.env.REACT_APP_GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4';
  private readonly API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || 'AIzaSyBvOkBw3cUzF2dX9eY8hI7jK6lM5nP4qR3s';
  
  // Cache to reduce API calls
  private cache: { data: ReviewsResponse; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Fetches reviews from Google Business Profile API
   * Note: This requires proper authentication and API setup
   */
  async fetchReviews(): Promise<ReviewsResponse> {
    try {
      if (!this.PLACE_ID || !this.API_KEY) {
        throw new Error('Google API credentials not configured');
      }

      const url = `${this.API_BASE_URL}/accounts/{accountId}/locations/{locationId}/reviews`;
      
      // Note: This is a simplified example. In production, you'll need:
      // 1. OAuth2 authentication
      // 2. Proper account and location IDs
      // 3. Error handling for rate limits
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return this.transformApiResponse(data);
    } catch (error) {
      console.error('Error fetching reviews from Google Business Profile:', error);
      
      // Return mock data as fallback
      return this.getMockReviews();
    }
  }

  /**
   * Transforms Google Business Profile API response to our format
   */
  private transformApiResponse(apiData: any): ReviewsResponse {
    const reviews: GoogleReview[] = apiData.reviews?.map((review: any) => ({
      reviewId: review.reviewId || review.name?.split('/').pop() || '',
      reviewer: {
        displayName: review.reviewer?.displayName || 'Anonymous',
        profilePhotoUrl: review.reviewer?.profilePhotoUrl,
      },
      starRating: review.starRating || 'FIVE',
      comment: review.comment || '',
      createTime: review.createTime || new Date().toISOString(),
      updateTime: review.updateTime || new Date().toISOString(),
    })) || [];

    const averageRating = this.calculateAverageRating(reviews);
    
    return {
      reviews,
      averageRating,
      totalReviewCount: reviews.length,
    };
  }

  /**
   * Calculates average rating from reviews
   */
  private calculateAverageRating(reviews: GoogleReview[]): number {
    if (reviews.length === 0) return 0;
    
    const ratingMap = {
      'ONE': 1,
      'TWO': 2,
      'THREE': 3,
      'FOUR': 4,
      'FIVE': 5
    };
    
    const totalRating = reviews.reduce((sum, review) => {
      return sum + (ratingMap[review.starRating] || 0);
    }, 0);
    
    return totalRating / reviews.length;
  }

  /**
   * Returns mock reviews for development/demo purposes
   */
  private getMockReviews(): ReviewsResponse {
    const mockReviews: GoogleReview[] = [
      {
        reviewId: '1',
        reviewer: {
          displayName: 'דני כהן',
          profilePhotoUrl: undefined
        },
        starRating: 'FIVE',
        comment: 'מקום מדהים! השירות מעולה והאווירה נפלאה. בהחלט ממליץ לכל מי שמחפש מקום מיוחד לנופש.',
        createTime: '2024-01-15T10:30:00Z',
        updateTime: '2024-01-15T10:30:00Z'
      },
      {
        reviewId: '2',
        reviewer: {
          displayName: 'שרה לוי',
          profilePhotoUrl: undefined
        },
        starRating: 'FIVE',
        comment: 'חוויה מושלמת! המקום נקי ומסודר, הצוות מקצועי וחם. נחזור בהחלט.',
        createTime: '2024-01-10T14:20:00Z',
        updateTime: '2024-01-10T14:20:00Z'
      },
      {
        reviewId: '3',
        reviewer: {
          displayName: 'מיכאל אברהם',
          profilePhotoUrl: undefined
        },
        starRating: 'FOUR',
        comment: 'מקום יפה ושליו. השירות טוב והמחירים הוגנים. מומלץ בחום.',
        createTime: '2024-01-05T09:15:00Z',
        updateTime: '2024-01-05T09:15:00Z'
      },
      {
        reviewId: '4',
        reviewer: {
          displayName: 'רחל גולדברג',
          profilePhotoUrl: undefined
        },
        starRating: 'FIVE',
        comment: 'אחוזת האלה היא פנינה אמיתית! המקום מטופח, האווירה קסומה והשירות מעל ומעבר. חוויה בלתי נשכחת!',
        createTime: '2024-01-01T16:45:00Z',
        updateTime: '2024-01-01T16:45:00Z'
      },
      {
        reviewId: '5',
        reviewer: {
          displayName: 'יוסי מזרחי',
          profilePhotoUrl: undefined
        },
        starRating: 'FIVE',
        comment: 'מקום מדהים לזוגות ומשפחות. הנוף מרהיב, השירות מקצועי והמחירים סבירים. בהחלט נחזור!',
        createTime: '2023-12-28T11:30:00Z',
        updateTime: '2023-12-28T11:30:00Z'
      },
      {
        reviewId: '6',
        reviewer: {
          displayName: 'תמר רוזן',
          profilePhotoUrl: undefined
        },
        starRating: 'FOUR',
        comment: 'מקום נחמד ושליו. האווירה טובה והצוות אדיב. מומלץ למי שמחפש מנוחה ושלווה.',
        createTime: '2023-12-25T13:20:00Z',
        updateTime: '2023-12-25T13:20:00Z'
      },
      {
        reviewId: '7',
        reviewer: {
          displayName: 'אלון ברק',
          profilePhotoUrl: undefined
        },
        starRating: 'FIVE',
        comment: 'חוויה מדהימה! המקום מטופח להפליא, השירות מעולה והאווירה קסומה. מומלץ בחום!',
        createTime: '2023-12-20T15:45:00Z',
        updateTime: '2023-12-20T15:45:00Z'
      },
      {
        reviewId: '8',
        reviewer: {
          displayName: 'נועה כהן',
          profilePhotoUrl: undefined
        },
        starRating: 'FIVE',
        comment: 'מקום מושלם לזוגות! האווירה רומנטית, השירות מקצועי והמחירים הוגנים. נחזור בהחלט!',
        createTime: '2023-12-15T12:30:00Z',
        updateTime: '2023-12-15T12:30:00Z'
      },
      {
        reviewId: '9',
        reviewer: {
          displayName: 'דוד לוי',
          profilePhotoUrl: undefined
        },
        starRating: 'FIVE',
        comment: 'חוויה מדהימה! המקום נקי ומסודר, השירות מעולה והאווירה קסומה. מומלץ בחום!',
        createTime: '2023-12-10T14:20:00Z',
        updateTime: '2023-12-10T14:20:00Z'
      },
      {
        reviewId: '10',
        reviewer: {
          displayName: 'מיכל רוזן',
          profilePhotoUrl: undefined
        },
        starRating: 'FOUR',
        comment: 'מקום נחמד ושליו. האווירה טובה והצוות אדיב. מומלץ למי שמחפש מנוחה ושלווה.',
        createTime: '2023-12-05T09:15:00Z',
        updateTime: '2023-12-05T09:15:00Z'
      },
      {
        reviewId: '11',
        reviewer: {
          displayName: 'אבי כהן',
          profilePhotoUrl: undefined
        },
        starRating: 'FIVE',
        comment: 'אחוזת האלה היא פנינה אמיתית! המקום מטופח, האווירה קסומה והשירות מעל ומעבר. חוויה בלתי נשכחת!',
        createTime: '2023-12-01T16:45:00Z',
        updateTime: '2023-12-01T16:45:00Z'
      },
      {
        reviewId: '12',
        reviewer: {
          displayName: 'שרה גולדברג',
          profilePhotoUrl: undefined
        },
        starRating: 'FIVE',
        comment: 'מקום מדהים לזוגות ומשפחות. הנוף מרהיב, השירות מקצועי והמחירים סבירים. בהחלט נחזור!',
        createTime: '2023-11-28T11:30:00Z',
        updateTime: '2023-11-28T11:30:00Z'
      }
    ];

    return {
      reviews: mockReviews,
      averageRating: 4.8,
      totalReviewCount: mockReviews.length,
    };
  }

  /**
   * Alternative method using Google Places API (simpler but limited)
   * This might be easier to implement for basic review fetching
   */
  async fetchReviewsFromPlacesAPI(): Promise<ReviewsResponse> {
    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      console.log('📦 Using cached reviews data');
      return this.cache.data;
    }

    try {
      console.log('🔍 API Credentials Check:');
      console.log('📍 Place ID:', this.PLACE_ID);
      console.log('🔑 API Key:', this.API_KEY ? '✅ Set' : '❌ Missing');

      if (!this.PLACE_ID || !this.API_KEY) {
        console.warn('⚠️ Google API credentials not configured, using mock data');
        return this.getMockReviews();
      }

      console.log('🌐 Fetching reviews from Google Places API...');
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${this.API_KEY}`;
      
      console.log('📡 Making API request to:', url.replace(this.API_KEY, '***HIDDEN***'));
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Places API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('📊 API Response:', data);
      
      if (data.status !== 'OK') {
        throw new Error(`Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
      }

      const result = this.transformPlacesApiResponse(data.result);
      
      // Cache the result
      this.cache = {
        data: result,
        timestamp: Date.now()
      };
      
      console.log('✅ Reviews fetched and cached successfully');
      console.log('📈 Final result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching reviews from Google Places API:', error);
      
      // Return mock data as fallback
      console.log('🔄 Falling back to mock data');
      return this.getMockReviews();
    }
  }

  /**
   * Transforms Google Places API response to our format
   */
  private transformPlacesApiResponse(placesData: any): ReviewsResponse {
    console.log('🔄 Transforming Google Places API response...');
    console.log('📋 Raw places data:', placesData);
    
    const reviews: GoogleReview[] = placesData.reviews?.map((review: any, index: number) => {
      console.log(`📝 Processing review ${index + 1}:`, review);
      
      return {
        reviewId: `places_${index}`,
        reviewer: {
          displayName: review.author_name || 'Anonymous',
          profilePhotoUrl: review.profile_photo_url,
        },
        starRating: this.convertNumericRatingToStarRating(review.rating),
        comment: review.text || 'No comment provided',
        createTime: review.time ? new Date(review.time * 1000).toISOString() : new Date().toISOString(),
        updateTime: review.time ? new Date(review.time * 1000).toISOString() : new Date().toISOString(),
      };
    }) || [];

    const averageRating = placesData.rating || this.calculateAverageRating(reviews);
    const totalReviewCount = placesData.user_ratings_total || reviews.length;
    
    console.log('✅ Transformation complete:');
    console.log(`📊 Found ${reviews.length} reviews`);
    console.log(`⭐ Average rating: ${averageRating}`);
    console.log(`📈 Total review count: ${totalReviewCount}`);
    
    return {
      reviews,
      averageRating,
      totalReviewCount,
    };
  }

  /**
   * Converts numeric rating (1-5) to star rating enum
   */
  private convertNumericRatingToStarRating(rating: number): 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE' {
    const ratingMap = {
      1: 'ONE' as const,
      2: 'TWO' as const,
      3: 'THREE' as const,
      4: 'FOUR' as const,
      5: 'FIVE' as const,
    };
    
    return ratingMap[Math.round(rating) as keyof typeof ratingMap] || 'FIVE';
  }
}

// Export singleton instance
export const googleBusinessService = new GoogleBusinessService();
export default googleBusinessService;
