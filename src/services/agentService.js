// src/services/agentService.js
// Agent Coordinator Service API integration (Port 8000)
import API_CONFIG, { apiFetch, generateToken } from './api.js';

// Add agent coordinator URL to config
const AGENT_URL = import.meta.env.VITE_AGENT_SERVICE_URL || 'http://localhost:8000';

/**
 * Execute a mission/query using agent coordinator
 */
export const executeQuery = async (query, context = {}) => {
  const url = `${AGENT_URL}/execute`;
  const token = generateToken();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, context }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Execution failed' }));
    throw new Error(error.detail || 'Failed to execute query');
  }
  return response.json();
};

/**
 * Execute Level 4 mission with self-evolution
 */
export const executeMissionV4 = async (mission, sessionId, context = {}) => {
  const url = `${AGENT_URL}/mission/execute-v4`;
  const token = generateToken();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ mission, session_id: sessionId, context }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Mission execution failed' }));
    throw new Error(error.detail || 'Failed to execute mission');
  }
  return response.json();
};

/**
 * Get list of registered agents
 */
export const getAgents = async () => {
  const url = `${AGENT_URL}/agents`;
  const token = generateToken();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to get agents');
  }
  return response.json();
};

/**
 * Get agent coordinator status
 */
export const getStatus = async () => {
  const url = `${AGENT_URL}/status`;
  const token = generateToken();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to get status');
  }
  return response.json();
};

/**
 * Check agent coordinator health (with JWT authentication)
 */
export const checkHealth = async () => {
  const url = `${AGENT_URL}/health`;
  const token = generateToken();
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export default { executeQuery, executeMissionV4, getAgents, getStatus, checkHealth };
