// src/services/forecastService.js
// TS Forecasting Service API integration (Port 8003)
import API_CONFIG, { apiFetch } from './api.js';

/**
 * Get forecast comparison from all models
 * @param {number[]} data - Historical price data
 * @param {number} horizon - Forecast horizon (days)
 * @param {string} frequency - Data frequency (D=daily, W=weekly, M=monthly)
 * @returns {Promise<Object>} - Forecast results
 */
export const getForecast = async (data, horizon = 30, frequency = 'D') => {
  const url = `${API_CONFIG.FORECAST_URL}/forecast/compare-all`;
  const response = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify({ data, horizon, frequency }),
  });

  // Map backend response to frontend expected format
  // Backend returns: comparison_table, detailed_results, best_model
  return {
    bestModel: response.best_model,
    comparisonTable: response.comparison_table,
    detailedResults: response.detailed_results || {},
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
 * Get last comparison results
 * @returns {Promise<Object>} - Last comparison data
 */
export const getLastComparison = async () => {
  const url = `${API_CONFIG.FORECAST_URL}/last-comparison`;
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

export default { getForecast, getModels, getLastComparison, checkHealth };
