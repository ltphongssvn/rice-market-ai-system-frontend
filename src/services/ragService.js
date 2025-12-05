// src/services/ragService.js
// RAG Orchestrator Service API integration (Port 8002)
import API_CONFIG, { apiFetch, generateToken } from './api.js';

/**
 * Send query to RAG service for document search
 */
export const queryRAG = async (query, maxResults = 5) => {
  const url = `${API_CONFIG.RAG_URL}/rag/query`;
  const response = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify({ query, max_results: maxResults }),
  });
  return {
    answer: response.answer,
    sources: response.retrieved_documents || [],
    confidence: response.confidence || 0,
    queryType: response.query_type,
    metadata: response.metadata || {},
  };
};

/**
 * Upload document to RAG knowledge base
 */
export const uploadDocument = async (file) => {
  const url = `${API_CONFIG.RAG_URL}/rag/upload`;
  const formData = new FormData();
  formData.append('file', file);
  const token = generateToken();
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(error.detail || 'Failed to upload document');
  }
  return response.json();
};

/**
 * Get list of indexed documents
 */
export const getDocuments = async () => {
  const url = `${API_CONFIG.RAG_URL}/rag/documents`;
  return apiFetch(url, { method: 'GET' });
};

/**
 * Delete a specific document from knowledge base
 */
export const deleteDocument = async (filename) => {
  const url = `${API_CONFIG.RAG_URL}/rag/documents/${encodeURIComponent(filename)}`;
  const token = generateToken();
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Delete failed' }));
    throw new Error(error.detail || 'Failed to delete document');
  }
  return response.json();
};

/**
 * Delete all documents from knowledge base
 */
export const deleteAllDocuments = async () => {
  const url = `${API_CONFIG.RAG_URL}/rag/documents`;
  const token = generateToken();
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Delete failed' }));
    throw new Error(error.detail || 'Failed to delete all documents');
  }
  return response.json();
};

/**
 * Get RAG service statistics
 */
export const getStats = async () => {
  const url = `${API_CONFIG.RAG_URL}/rag/stats`;
  return apiFetch(url, { method: 'GET' });
};

/**
 * Check RAG service health (with JWT authentication)
 */
export const checkHealth = async () => {
  const url = `${API_CONFIG.RAG_URL}/health`;
  const token = generateToken();
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export default { queryRAG, uploadDocument, getDocuments, deleteDocument, deleteAllDocuments, getStats, checkHealth };
