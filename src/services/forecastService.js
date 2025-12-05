// src/services/forecastService.js
// TS Forecasting Service API integration (Port 8003)
import API_CONFIG, { apiFetch, generateToken } from './api.js';

/**
 * Get forecast comparison from all models
 */
export const getForecast = async (data, horizon = 30, frequency = 'D') => {
  const url = `${API_CONFIG.FORECAST_URL}/compare-all`;
  const response = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify({ data, horizon, frequency }),
  });
  return {
    bestModel: response.best_model,
    comparisonTable: response.comparison_table,
    detailedResults: response.detailed_results || {},
  };
};

/**
 * Get available forecast models
 */
export const getModels = async () => {
  const url = `${API_CONFIG.FORECAST_URL}/models`;
  return apiFetch(url, { method: 'GET' });
};

/**
 * Get last comparison results
 */
export const getLastComparison = async () => {
  const url = `${API_CONFIG.FORECAST_URL}/last-comparison`;
  return apiFetch(url, { method: 'GET' });
};

/**
 * Check Forecast service health (with JWT authentication)
 */
export const checkHealth = async () => {
  const url = `${API_CONFIG.FORECAST_URL}/health`;
  const token = generateToken();
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export default { getForecast, getModels, getLastComparison, checkHealth };
