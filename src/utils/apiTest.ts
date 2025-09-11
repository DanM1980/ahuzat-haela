// Utility to test Google Places API connection
import { googleBusinessService } from '../services/googleBusinessService';

export const testGooglePlacesAPI = async () => {
  console.log('🧪 Testing Google Places API connection...');
  
  try {
    const result = await googleBusinessService.fetchReviewsFromPlacesAPI();
    
    console.log('✅ API Test Results:');
    console.log(`📊 Total Reviews: ${result.totalReviewCount}`);
    console.log(`⭐ Average Rating: ${result.averageRating}`);
    console.log(`📝 Reviews:`, result.reviews);
    
    if (result.reviews.length > 0) {
      console.log('🎉 API connection successful! Real reviews loaded.');
    } else {
      console.log('⚠️ No reviews found. Check your Place ID.');
    }
    
    return result;
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    console.log('📋 API connection failed. Check your credentials.');
    return null;
  }
};

// Function to validate API credentials
export const validateAPICredentials = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const placeId = process.env.REACT_APP_GOOGLE_PLACE_ID;
  
  console.log('🔍 Validating API credentials...');
  
  if (!apiKey || apiKey === 'your_google_api_key_here') {
    console.warn('⚠️ Google API Key not configured');
    return false;
  }
  
  if (!placeId || placeId === 'your_place_id_here') {
    console.warn('⚠️ Google Place ID not configured');
    return false;
  }
  
  console.log('✅ API credentials are configured');
  return true;
};

// Function to get Place ID from business name (helper)
export const findPlaceId = async (businessName: string, apiKey: string) => {
  try {
    const encodedName = encodeURIComponent(businessName);
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodedName}&inputtype=textquery&fields=place_id&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.candidates.length > 0) {
      return data.candidates[0].place_id;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding Place ID:', error);
    return null;
  }
};
