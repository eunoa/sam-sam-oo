export function isAuthenticated() {
  return Boolean(localStorage.getItem('accessToken'))
}
