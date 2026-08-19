const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ACCESS_TOKEN_KEY = 'accessToken';

// accessToken 저장
export function setAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// accessToken 조회
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// accessToken 삭제
export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// 공통 API 요청
export async function apiClient(
  endpoint,
  options = {}
) {
  const token = getAccessToken();

  const headers = {
    ...(options.headers || {}),
  };

  // JSON 요청인 경우
  if (
    options.body &&
    typeof options.body !== 'string'
  ) {
    headers['Content-Type'] = 'application/json';
  }

  // JWT accessToken이 있으면 자동으로 Authorization 추가
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `API 요청 실패: ${response.status}`
    );
  }

  // 응답 본문이 없는 경우
  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get('content-type');

  if (
    contentType &&
    contentType.includes('application/json')
  ) {
    return response.json();
  }

  return response.text();
}