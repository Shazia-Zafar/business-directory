/**
 * Local Business Directory - Configuration
 * 
 * In local development, the API runs at http://localhost:5000/api.
 * When deployed to Render, replace API_BASE_URL with your Render service URL:
 * e.g., "https://business-directory-api.onrender.com/api"
 */

// If window.RENDER_API_URL is set, use it; otherwise default to local server
const API_BASE_URL = window.RENDER_API_URL || "http://localhost:5000/api";

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
