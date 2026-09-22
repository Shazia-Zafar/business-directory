/**
 * Local Business Directory - Configuration
 * 
 * Deployed backend: Railway
 */

const API_BASE_URL = "https://business-directory-production-701a.up.railway.app/api";

// Category palette definitions matching the design system
const CATEGORY_COLORS = {
  Food: "#e06d44",
  Fashion: "#cf4d85",
  Tech: "#3d8bfd",
  Health: "#2bb673",
  Education: "#d49e24",
  Services: "#8a6fe8",
  Retail: "#df9437",
  Other: "#7b8794",
};

// Export configuration
window.APP_CONFIG = {
  apiBaseUrl: API_BASE_URL,
  categoryColors: CATEGORY_COLORS,
  categories: ["Food", "Fashion", "Tech", "Health", "Education", "Services", "Retail", "Other"]
};
