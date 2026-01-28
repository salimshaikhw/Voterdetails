// Utility functions for JWT token handling

export function setToken(token) {
  localStorage.setItem('jwt_token', token);
}

export function getToken() {
  return localStorage.getItem('jwt_token');
}

export function removeToken() {
  localStorage.removeItem('jwt_token');
}

export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}
