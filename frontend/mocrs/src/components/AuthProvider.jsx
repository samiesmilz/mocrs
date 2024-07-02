// components/authProvider

import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const USER_STORAGE_KEY = "mocrsLocalUser";
const TOKEN_STORAGE_KEY = "mocrsAuthToken";
const LOGOUT_EVENT = "app_logout";

export const AuthProvider = ({ children }) => {
  const [mocrsUser, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        setUser(null);
        setToken(null);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();

    const handleStorageChange = (e) => {
      if (
        e.key === USER_STORAGE_KEY ||
        e.key === TOKEN_STORAGE_KEY ||
        e.key === LOGOUT_EVENT
      ) {
        loadUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    } catch (error) {
      console.error(
        "Failed to save user data or token to localStorage:",
        error
      );
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.setItem(LOGOUT_EVENT, Date.now().toString());
      localStorage.removeItem(LOGOUT_EVENT);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updateToken = (newToken) => {
    setToken(newToken);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } catch (error) {
      console.error("Failed to update token in localStorage:", error);
    }
  };

  const value = {
    mocrsUser,
    token,
    login,
    logout,
    updateToken,
    isLoading,
    isAuthenticated: !!mocrsUser && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
