// Google Business Profile API Service with OAuth
// This service handles fetching ALL reviews from Google Business Profile API

export interface GoogleBusinessReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

export interface GoogleBusinessReviewsResponse {
  reviews: GoogleBusinessReview[];
  averageRating: number;
  totalReviewCount: number;
  nextPageToken?: string;
}

export interface OAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

class GoogleBusinessOAuthService {
  private readonly API_BASE_URL = 'https://mybusiness.googleapis.com/v4';
  private readonly CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  private readonly CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  private readonly REDIRECT_URI = `${window.location.origin}/oauth/callback`;
  
  // Cache for reviews
  private cache: { data: GoogleBusinessReviewsResponse; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Initiates OAuth2 flow for Google Business Profile API
   */
  async initiateOAuthFlow(): Promise<string> {
    if (!this.CLIENT_ID) {
      throw new Error('Google Client ID not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in .env file');
    }

    const scope = 'https://www.googleapis.com/auth/business.manage';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${this.CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${Date.now()}`;

    // Open OAuth popup
    const popup = window.open(
      authUrl, 
      'google-oauth', 
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );
    
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error('OAuth popup was closed by user'));
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
  async exchangeCodeForToken(code: string): Promise<OAuthTokens> {
    if (!this.CLIENT_ID || !this.CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not configured. Please set REACT_APP_GOOGLE_CLIENT_ID and REACT_APP_GOOGLE_CLIENT_SECRET in .env file');
    }

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
        redirect_uri: this.REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token exchange failed: ${response.status} - ${errorData.error_description || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Refreshes access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    if (!this.CLIENT_ID || !this.CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not configured');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Fetches all reviews using Google Business Profile API with OAuth
   */
  async fetchAllReviewsWithOAuth(): Promise<GoogleBusinessReviewsResponse> {
    try {
      // Check cache first
      if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
        console.log('📦 Using cached reviews data');
        return this.cache.data;
      }

      // Step 1: Get OAuth code
      console.log('🔐 Starting OAuth flow...');
      const code = await this.initiateOAuthFlow();
      
      // Step 2: Exchange code for token
      console.log('🔄 Exchanging code for token...');
      const tokens = await this.exchangeCodeForToken(code);
      
      // Step 3: Fetch reviews with token
      console.log('📊 Fetching reviews with token...');
      const reviewsData = await this.fetchReviewsWithToken(tokens.access_token);
      
      // Cache the result
      this.cache = {
        data: reviewsData,
        timestamp: Date.now()
      };
      
      console.log('✅ All reviews fetched and cached successfully');
      return reviewsData;
    } catch (error) {
      console.error('❌ OAuth flow failed:', error);
      throw error;
    }
  }

  /**
   * Fetches reviews using access token
   */
  private async fetchReviewsWithToken(accessToken: string): Promise<GoogleBusinessReviewsResponse> {
    // First, get the account ID
    const accountsResponse = await fetch(`${this.API_BASE_URL}/accounts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!accountsResponse.ok) {
      throw new Error(`Failed to fetch accounts: ${accountsResponse.status}`);
    }

    const accountsData = await accountsResponse.json();
    const accountId = accountsData.accounts?.[0]?.name?.split('/').pop();
    
    if (!accountId) {
      throw new Error('No Google Business Profile account found');
    }

    console.log('🏢 Found account ID:', accountId);

    // Get locations for the account
    const locationsResponse = await fetch(`${this.API_BASE_URL}/accounts/${accountId}/locations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!locationsResponse.ok) {
      throw new Error(`Failed to fetch locations: ${locationsResponse.status}`);
    }

    const locationsData = await locationsResponse.json();
    const locationId = locationsData.locations?.[0]?.name?.split('/').pop();
    
    if (!locationId) {
      throw new Error('No Google Business Profile location found');
    }

    console.log('📍 Found location ID:', locationId);

    // Fetch all reviews with pagination
    let allReviews: GoogleBusinessReview[] = [];
    let nextPageToken: string | undefined;
    let pageCount = 0;
    const maxPages = 50; // Safety limit

    do {
      pageCount++;
      console.log(`📄 Fetching page ${pageCount}...`);
      
      const reviewsUrl = `${this.API_BASE_URL}/accounts/${accountId}/locations/${locationId}/reviews` +
        (nextPageToken ? `?pageToken=${nextPageToken}` : '');
      
      const reviewsResponse = await fetch(reviewsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!reviewsResponse.ok) {
        throw new Error(`Failed to fetch reviews: ${reviewsResponse.status}`);
      }

      const reviewsData = await reviewsResponse.json();
      
      if (reviewsData.reviews) {
        const transformedReviews = reviewsData.reviews.map((review: any) => this.transformReview(review));
        allReviews = [...allReviews, ...transformedReviews];
        console.log(`✅ Fetched ${transformedReviews.length} reviews (total: ${allReviews.length})`);
      }
      
      nextPageToken = reviewsData.nextPageToken;
      
      // Add delay to avoid rate limiting
      if (nextPageToken && pageCount < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } while (nextPageToken && pageCount < maxPages);

    console.log(`🎉 Fetched total of ${allReviews.length} reviews`);

    // Sort reviews by date (newest first)
    allReviews.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

    // Calculate average rating
    const averageRating = this.calculateAverageRating(allReviews);
    
    return {
      reviews: allReviews,
      averageRating,
      totalReviewCount: allReviews.length,
    };
  }

  /**
   * Transforms a single review from API format to our format
   */
  private transformReview(apiReview: any): GoogleBusinessReview {
    return {
      reviewId: apiReview.reviewId || apiReview.name?.split('/').pop() || '',
      reviewer: {
        displayName: apiReview.reviewer?.displayName || 'Anonymous',
        profilePhotoUrl: apiReview.reviewer?.profilePhotoUrl,
      },
      starRating: apiReview.starRating || 'FIVE',
      comment: apiReview.comment || '',
      createTime: apiReview.createTime || new Date().toISOString(),
      updateTime: apiReview.updateTime || new Date().toISOString(),
      reviewReply: apiReview.reviewReply ? {
        comment: apiReview.reviewReply.comment || '',
        updateTime: apiReview.reviewReply.updateTime || new Date().toISOString(),
      } : undefined,
    };
  }

  /**
   * Calculates average rating from reviews
   */
  private calculateAverageRating(reviews: GoogleBusinessReview[]): number {
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
   * Clears the cache
   */
  clearCache(): void {
    this.cache = null;
    console.log('🗑️ Cache cleared');
  }
}

// Export singleton instance
export const googleBusinessOAuthService = new GoogleBusinessOAuthService();
export default googleBusinessOAuthService;
