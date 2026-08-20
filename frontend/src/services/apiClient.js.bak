const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const request = async (endpoint, options = {}) => {
  const token = getAccessToken();

  const headers = {
    ...(options.body !== undefined
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    throw new Error('로그인이 만료되었습니다.');
  }

  if (!response.ok) {
    let errorMessage = 'API 요청에 실패했습니다.';

    try {
      const errorData = await response.json();

      if (errorData.message) {
        errorMessage = errorData.message;
      }

      if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        errorMessage = errorData.errors
          .map((error) => error.message || error)
          .join('\n');
      }
    } catch {
      // Response Body가 없는 경우 기본 에러 메시지를 사용한다.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
};

const apiClient = {
  get: (endpoint, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'GET',
    }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: (endpoint, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'DELETE',
    }),
};

export default apiClient;
