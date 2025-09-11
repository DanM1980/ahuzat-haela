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
  private readonly CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  private readonly CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  
  // Cache to reduce API calls
  private cache: { data: ReviewsResponse; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Initiates OAuth2 flow for Google Business Profile API
   */
  async initiateOAuthFlow(): Promise<string> {
    if (!this.CLIENT_ID) {
      throw new Error('Google Client ID not configured');
    }

    const redirectUri = `${window.location.origin}/oauth/callback`;
    const scope = 'https://www.googleapis.com/auth/business.manage';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${this.CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    // Open OAuth popup
    const popup = window.open(authUrl, 'google-oauth', 'width=500,height=600');
    
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error('OAuth popup was closed'));
        }
      }, 1000);

      // Listen for OAuth callback
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup?.close();
          resolve(event.data.code);
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup?.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageListener);
    });
  }

  /**
   * Exchanges authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    if (!this.CLIENT_ID || !this.CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not configured');
    }

    const redirectUri = `${window.location.origin}/oauth/callback`;
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Fetches all reviews using Google Business Profile API with OAuth
   */
  async fetchAllReviewsWithOAuth(): Promise<ReviewsResponse> {
    try {
      // Step 1: Get OAuth code
      const code = await this.initiateOAuthFlow();
      
      // Step 2: Exchange code for token
      const accessToken = await this.exchangeCodeForToken(code);
      
      // Step 3: Fetch reviews with token
      return await this.fetchReviewsWithToken(accessToken);
    } catch (error) {
      console.error('OAuth flow failed:', error);
      throw error;
    }
  }

  /**
   * Fetches reviews using access token
   */
  private async fetchReviewsWithToken(accessToken: string): Promise<ReviewsResponse> {
    // This is a simplified example - you'll need the actual account and location IDs
    const url = `${this.API_BASE_URL}/accounts/{accountId}/locations/{locationId}/reviews`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return this.transformApiResponse(data);
  }

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
      throw error;
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
   * Alternative method using Google Places API (simpler but limited)
   * This might be easier to implement for basic review fetching
   */
  async fetchReviewsFromPlacesAPI(): Promise<ReviewsResponse> {
    // Skip cache for now to ensure fresh data
    console.log('🔄 Skipping cache to get fresh data');
    
    // Check cache first (disabled for debugging)
    // if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
    //   console.log('📦 Using cached reviews data');
    //   return this.cache.data;
    // }

    console.log('🔍 API Credentials Check:');
    console.log('📍 Place ID:', this.PLACE_ID);
    console.log('🔑 API Key:', this.API_KEY ? '✅ Set' : '❌ Missing');

    if (!this.PLACE_ID || !this.API_KEY) {
      throw new Error('Google API credentials not configured. Please set REACT_APP_GOOGLE_API_KEY and REACT_APP_GOOGLE_PLACE_ID in .env file');
    }

    console.log('🌐 Fetching reviews from Google Places API...');
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${this.API_KEY}`;
    
    console.log('📡 Making API request to:', url.replace(this.API_KEY, '***HIDDEN***'));
    
    // Use CORS proxy to bypass CORS restrictions
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    console.log('🔄 Using CORS proxy:', proxyUrl);
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Places API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('📊 API Response:', data);
    console.log('🔍 Response details:');
    console.log(`📊 Status: ${data.status}`);
    console.log(`📈 Result rating: ${data.result?.rating}`);
    console.log(`📊 Result user_ratings_total: ${data.result?.user_ratings_total}`);
    console.log(`📝 Result reviews count: ${data.result?.reviews?.length || 0}`);
    
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

    // Google Places API only returns 5 reviews max, but provides official rating and total count
    const googleRating = placesData.rating;
    const googleTotalCount = placesData.user_ratings_total;
    
    console.log('🔍 Google API data:');
    console.log(`📊 Google rating: ${googleRating}`);
    console.log(`📈 Google total count: ${googleTotalCount}`);
    console.log(`📝 Reviews returned by API: ${reviews.length} (max 5)`);
    
    // Always use Google's official data for rating and total count
    // The 5 reviews are just for display, not for calculating stats
    const averageRating = googleRating || 0;
    const totalReviewCount = googleTotalCount || 0;
    
    console.log('✅ Using Google official data:');
    console.log(`📊 Official rating: ${averageRating}`);
    console.log(`📈 Official total count: ${totalReviewCount}`);
    console.log(`📝 Display reviews: ${reviews.length}`);
    
    // Force refresh if data seems wrong
    if (averageRating === 0 || totalReviewCount === 0) {
      console.warn('⚠️ WARNING: Google data is missing or zero!');
      console.log('🔍 Raw placesData:', JSON.stringify(placesData, null, 2));
    }
    
    console.log('✅ Final data:');
    console.log(`📊 Final rating: ${averageRating}`);
    console.log(`📈 Final count: ${totalReviewCount}`);
    
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
