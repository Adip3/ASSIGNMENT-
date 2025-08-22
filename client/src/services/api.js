// src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// IMPORTANT: Update the response interceptor to NOT redirect automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 for non-auth endpoints
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes("/auth/");

      if (!isAuthEndpoint) {
        // Only clear auth for non-auth endpoints
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    try {
      console.log("Making login API call with:", credentials.email);

      const response = await api.post("/auth/login", credentials);

      console.log("API Response:", response.data);

      // Your backend returns: { message, token, user }
      // We return the entire response.data
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      console.log("Register API Response:", response.data);

      // Return the entire response.data
      return response.data;
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Don't redirect here
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getProfile: async () => {
    try {
      const response = await api.get("/users/profile/me");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },
};

// User Service
export const userService = {
  getProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId || "me"}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    const response = await api.post("/users/upload-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data;
  },
};

// Post Service
export const postService = {
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post("/posts", postData);
    return response.data;
  },

  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  },

  commentOnPost: async (postId, comment) => {
    const response = await api.post(`/posts/${postId}/comment`, {
      text: comment,
    });
    return response.data;
  },

  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`/posts/${postId}/comment/${commentId}`);
    return response.data;
  },
};

// Job Service
export const jobService = {
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/jobs?${params}`);
    return response.data;
  },

  getJob: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  applyToJob: async (jobId, applicationData) => {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },

  getApplications: async () => {
    const response = await api.get("/jobs/applications");
    return response.data;
  },

  saveJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/save`);
    return response.data;
  },

  unsaveJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}/save`);
    return response.data;
  },

  getSavedJobs: async () => {
    const response = await api.get("/jobs/saved");
    return response.data;
  },
};

// Connection Service
export const connectionService = {
  getConnections: async () => {
    const response = await api.get("/connections");
    return response.data;
  },

  sendConnectionRequest: async (userId) => {
    const response = await api.post(`/connections/request/${userId}`);
    return response.data;
  },

  acceptConnection: async (connectionId) => {
    const response = await api.put(`/connections/accept/${connectionId}`);
    return response.data;
  },

  rejectConnection: async (connectionId) => {
    const response = await api.delete(`/connections/reject/${connectionId}`);
    return response.data;
  },

  removeConnection: async (userId) => {
    const response = await api.delete(`/connections/${userId}`);
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get("/connections/pending");
    return response.data;
  },

  getSentRequests: async () => {
    const response = await api.get("/connections/sent");
    return response.data;
  },

  getSuggestions: async () => {
    const response = await api.get("/connections/suggestions");
    return response.data;
  },
};

// Message Service
export const messageService = {
  getConversations: async () => {
    const response = await api.get("/messages/conversations");
    return response.data;
  },

  getMessages: async (userId) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },

  sendMessage: async (recipientId, message) => {
    const response = await api.post("/messages", {
      recipientId,
      text: message,
    });
    return response.data;
  },

  markAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },
};

// Notification Service
export const notificationService = {
  getNotifications: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

// Admin Service
export const adminService = {
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/users?${queryParams}`);
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getReportedContent: async () => {
    const response = await api.get("/admin/reports");
    return response.data;
  },

  handleReport: async (reportId, action) => {
    const response = await api.put(`/admin/reports/${reportId}`, { action });
    return response.data;
  },
};

export default api;
