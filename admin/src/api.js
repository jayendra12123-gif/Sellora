const resolveDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  const host = window.location.hostname || 'localhost';
  return `http://${host}:5000`;
};

const API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || resolveDefaultApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminAuthToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
};

export const adminGet = async (path) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return parseResponse(response);
};

export const adminPost = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body || {}),
  });
  return parseResponse(response);
};

export const adminPut = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body || {}),
  });
  return parseResponse(response);
};

export const adminDelete = async (path) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  return parseResponse(response);
};

export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseResponse(response);
  localStorage.setItem('adminAuthToken', data.token);
  localStorage.setItem('adminUser', JSON.stringify(data.user));
  return data;
};

export const adminLogout = async () => {
  const token = localStorage.getItem('adminAuthToken');
  if (token) {
    fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch(() => {});
  }

  localStorage.removeItem('adminAuthToken');
  localStorage.removeItem('adminUser');
};

export const getAdminUser = () => {
  const raw = localStorage.getItem('adminUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const refreshAdminUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  const data = await parseResponse(response);
  localStorage.setItem('adminUser', JSON.stringify(data.user));
  return data.user;
};
