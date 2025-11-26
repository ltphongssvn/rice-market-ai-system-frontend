// src/services/forecastService.js
// TS Forecasting Service API integration (Port 8003)

import API_CONFIG, { apiFetch } from './api.js';

/**
 * Get forecast comparison from all models
 * @param {number[]} data - Historical price data
 * @param {number} horizon - Forecast horizon (months)
 * @returns {Promise<Object>} - Forecast results
 */
export const getForecast = async (data, horizon = 6) => {
  const url = `${API_CONFIG.FORECAST_URL}/forecast/compare-all`;
  
  const response = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify({ data, horizon }),
  });
  
  // Map backend response to frontend expected format
  return {
    bestModel: response.best_model,
    detailedResults: response.detailed_results || {},
    predictions: response.predictions || [],
    metrics: response.metrics || {},
  };
};

/**
 * Get available forecast models
 * @returns {Promise<Object>} - Available models
 */
export const getModels = async () => {
  const url = `${API_CONFIG.FORECAST_URL}/models`;
  return apiFetch(url, { method: 'GET' });
};

/**
 * Check Forecast service health
 * @returns {Promise<Object>} - Health status
 */
export const checkHealth = async () => {
  const url = `${API_CONFIG.FORECAST_URL}/health`;
  const response = await fetch(url);
  return response.json();
};

export default { getForecast, getModels, checkHealth };
