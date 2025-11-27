// src/services/ragService.js
// RAG Orchestrator Service API integration (Port 8002)
import API_CONFIG, { apiFetch } from './api.js';

/**
 * Send query to RAG service for document search
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results to return
 * @returns {Promise<Object>} - RAG response with answer
 */
export const queryRAG = async (query, maxResults = 5) => {
  const url = `${API_CONFIG.RAG_URL}/rag/query`;
  const response = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify({ query, max_results: maxResults }),
  });

  // Map backend response to frontend expected format
  // Backend returns: retrieved_documents, answer, confidence, query, query_type, metadata
  return {
    answer: response.answer,
    sources: response.retrieved_documents || [],
    confidence: response.confidence || 0,
    queryType: response.query_type,
    metadata: response.metadata || {},
  };
};

/**
 * Get RAG service statistics
 * @returns {Promise<Object>} - RAG stats
 */
export const getStats = async () => {
  const url = `${API_CONFIG.RAG_URL}/rag/stats`;
  return apiFetch(url, { method: 'GET' });
};

/**
 * Check RAG service health
 * @returns {Promise<Object>} - Health status
 */
export const checkHealth = async () => {
  const url = `${API_CONFIG.RAG_URL}/health`;
  const response = await fetch(url);
  return response.json();
};

export default { queryRAG, getStats, checkHealth };
