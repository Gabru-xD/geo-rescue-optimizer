
// Environment variable configuration

// MongoDB connection URI
export const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || '';

// Check if MongoDB is enabled
export const isMongoDB = !!MONGODB_URI;

// Default map center (fallback if geolocation is not available)
export const DEFAULT_MAP_CENTER = {
  latitude: 37.7749,
  longitude: -122.4194
};

// Helper function to validate environment variables
export const validateEnv = () => {
  const missingVars = [];
  
  if (!MONGODB_URI) {
    missingVars.push('VITE_MONGODB_URI');
    console.warn('VITE_MONGODB_URI is not set. The application will use mock data.');
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars
  };
};
