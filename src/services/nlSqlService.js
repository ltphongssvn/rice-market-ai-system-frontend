// src/services/nlSqlService.js
// NL-SQL Service API integration (Port 8001)
import API_CONFIG, { apiFetch, generateToken } from './api.js';

/**
 * Send natural language query to NL-SQL service
 * @param {string} question - Natural language question
 * @returns {Promise<Object>} - SQL query and results
 */
export const executeNLQuery = async (question) => {
  const url = `${API_CONFIG.NL_SQL_URL}/query`;
  const response = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
  return {
    query: response.question,
    sqlGenerated: response.sql_query,
    data: response.results || [],
    rowCount: response.row_count || 0,
    success: response.success,
  };
};

/**
 * Check NL-SQL service health (with JWT authentication)
 * @returns {Promise<Object>} - Health status
 */
export const checkHealth = async () => {
  const url = `${API_CONFIG.NL_SQL_URL}/health`;
  const token = generateToken();
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export default { executeNLQuery, checkHealth };
