import api from './api';

// Login user
export const login = async (emailOrPhone, password) => {
  try {
    const response = await api.post('/auth/login', { emailOrPhone, password });
    
    // Store token in localStorage
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') ? true : false;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('token');
};