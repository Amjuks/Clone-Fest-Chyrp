import API from './api';

export const getCSRFToken = () => API.get('csrf/');
export const getCurrentUser = () => API.get('me/');
export const login = (username, password) =>
  API.post('login/', { username, password });
export const register = (username, password) =>
  API.post('register/', { username, password });
export const logout = () => API.post('logout/');