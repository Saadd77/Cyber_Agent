// In Vite, environment variables must be prefixed with VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/v1/auth/signup`,
  },
  PROJECTS: {
    LIST: `${API_BASE_URL}/api/v1/projects`,
    CREATE: `${API_BASE_URL}/api/v1/projects`,
    GET: (id: string) => `${API_BASE_URL}/api/v1/projects/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/v1/projects/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/v1/projects/${id}`,
  },
  TARGETS: {
    LIST: (projectId: string) => `${API_BASE_URL}/api/v1/targets/project/${projectId}`,
    CREATE: `${API_BASE_URL}/api/v1/targets`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/v1/targets/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/v1/targets/${id}`,
  },
  AGENTS: {
    EXECUTE: `${API_BASE_URL}/api/v1/agents/execute`,
    STATUS: (id: string) => `${API_BASE_URL}/api/v1/agents/status/${id}`,
    RESULTS: (id: string) => `${API_BASE_URL}/api/v1/agents/results/${id}`,
  },
  WEBSOCKET: {
    TERMINAL: (sessionId: string) => `ws://localhost:8000/ws/terminal/${sessionId}`,
  }
};

export default API_ENDPOINTS;