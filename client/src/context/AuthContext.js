// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (e) {
          console.error("Failed to parse stored user:", e);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      console.log("Attempting login with:", credentials.email);

      const response = await authService.login(credentials);
      console.log("Raw response from authService:", response);

      // Your backend returns user data directly in response with token
      // Check if we have token and _id (which indicates user data)
      if (response && response.token && response._id) {
        // Extract user data from response (everything except message and token)
        const userData = {
          _id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
          profilePicture: response.profilePicture || "",
          headline: response.headline || "",
        };

        console.log("Login successful, setting user:", userData);

        // Store in localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update state
        setUser(userData);

        return { success: true, user: userData };
      } else {
        console.error("Invalid response structure:", response);
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);

      const response = await authService.register(userData);
      console.log("Register response:", response);

      // Check for the same structure as login (user data directly in response)
      if (response && response.token && response._id) {
        // Extract user data from response
        const userInfo = {
          _id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
          profilePicture: response.profilePicture || "",
          headline: response.headline || "",
        };

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);

        return { success: true, user: userInfo };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Register error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isJobPoster: user?.role === "job_poster" || user?.role === "recruiter",
    isJobSeeker: user?.role === "job_seeker",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
