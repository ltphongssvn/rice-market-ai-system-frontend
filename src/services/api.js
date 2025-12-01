// src/services/api.js
// Base API configuration for backend service integration

import { KJUR } from 'jsrsasign';

// Environment-based API URLs (localhost for development)
const API_CONFIG = {
  NL_SQL_URL: import.meta.env.VITE_NL_SQL_SERVICE_URL || 'http://localhost:8001',
  RAG_URL: import.meta.env.VITE_RAG_SERVICE_URL || 'http://localhost:8002',
  FORECAST_URL: import.meta.env.VITE_FORECAST_SERVICE_URL || 'http://localhost:8003',
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'dev-secret-key-change-in-production',
};

/**
 * Generate properly signed JWT token for API authentication
 * Uses HMAC-SHA256 algorithm matching backend expectations
 */
export const generateToken = () => {
  const now = Math.floor(Date.now() / 1000);
  
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: 'frontend-user',
    exp: now + 3600, // 1 hour
    iat: now,
    aud: ['nl-sql', 'rag', 'ts-forecast', 'agent-coordinator'],
  };

  // Sign with HMAC-SHA256 using jsrsasign
  const token = KJUR.jws.JWS.sign('HS256', JSON.stringify(header), JSON.stringify(payload), API_CONFIG.JWT_SECRET);
  
  return token;
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
