// src/services/api.js
// Base API configuration for backend service integration

// Environment-based API URLs (localhost for development)
const API_CONFIG = {
  NL_SQL_URL: import.meta.env.VITE_NL_SQL_SERVICE_URL || 'http://localhost:8001',
  RAG_URL: import.meta.env.VITE_RAG_SERVICE_URL || 'http://localhost:8002',
  FORECAST_URL: import.meta.env.VITE_FORECAST_SERVICE_URL || 'http://localhost:8003',
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'dev-secret-key-change-in-production',
};

/**
 * Generate JWT token for API authentication
 * Note: In production, tokens should come from a proper auth service
 * This is for development/demo purposes matching backend expectations
 */
export const generateToken = () => {
  // Simple base64 JWT for development (matches backend dev-secret-key)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    sub: 'frontend-user',
    exp: now + 3600, // 1 hour
    iat: now,
    aud: ['nl-sql', 'rag', 'ts-forecast', 'agent-coordinator'],
  }));
  // Note: This creates an unsigned token structure
  // Backend in dev mode accepts this; production needs proper signing
  const signature = 'dev-signature';
  return `${header}.${payload}.${signature}`;
};

/**
 * Base fetch wrapper with authentication and error handling
 */
export const apiFetch = async (url, options = {}) => {
  const token = generateToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }
  
  return response.json();
};

export default API_CONFIG;
