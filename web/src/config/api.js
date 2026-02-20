const resolveDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  const host = window.location.hostname || 'localhost';
  return `http://${host}:5000`;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || resolveDefaultApiBaseUrl();

export const API_URL = `${API_BASE_URL}/api`;
export const AUTH_API_URL = `${API_URL}/auth`;
