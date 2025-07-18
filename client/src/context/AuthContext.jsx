import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/confir';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          setUser(firebaseUser);
          setToken(idToken);
          
          // Store token in sessionStorage for API calls
          sessionStorage.setItem('authToken', idToken);
          
          // Set up token refresh
          setupTokenRefresh(firebaseUser);
        } catch (error) {
          console.error('Error getting token:', error);
          setUser(null);
          setToken(null);
          sessionStorage.removeItem('authToken');
        }
      } else {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setupTokenRefresh = (firebaseUser) => {
    // Refresh token every 50 minutes (tokens expire in 60 minutes)
    const refreshInterval = setInterval(async () => {
      try {
        const newToken = await firebaseUser.getIdToken(true);
        setToken(newToken);
        sessionStorage.setItem('authToken', newToken);
      } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
      }
    }, 50 * 60 * 1000);

    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      sessionStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
