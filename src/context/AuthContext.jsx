import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Create the authentication context
const AuthContext = createContext();

// Auth context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Set user from localStorage initially
          setUser(authService.getUser());
          
          // Then verify with the server
          const response = await authService.getProfile();
          if (response.data && response.data.user) {
            setUser(response.data.user);
            // Update localStorage with the latest user data
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // If the server check fails, clear stored data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    authService.logout();
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user password
  const updatePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updatePassword(passwordData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.resetPassword(token, password);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword
  };

  // Provide the auth context to children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
