// src/context/AppContext.js
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";

const AppContext = createContext({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Global UI State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Modal States
  const [modals, setModals] = useState({
    createPost: false,
    editProfile: false,
    connections: false,
    jobApplication: false,
    messaging: false,
  });

  // Feed State
  const [feedPosts, setFeedPosts] = useState([]);
  const [feedPage, setFeedPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // Network State
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connectionSuggestions, setConnectionSuggestions] = useState([]);

  // Job State
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Messages State
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [activeConversation, setActiveConversation] = useState(null);

  // Search State
  const [searchResults, setSearchResults] = useState({
    users: [],
    jobs: [],
    posts: [],
    companies: [],
  });
  const [searchFilters, setSearchFilters] = useState({
    type: "all",
    location: "",
    industry: "",
    experience: "",
    jobType: "",
    datePosted: "",
  });

  // Notification Management
  const showNotification = useCallback((message, type = "info") => {
    const notification = {
      id: Date.now(),
      message,
      type, // 'success', 'error', 'warning', 'info'
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Theme Management
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.body.className = newTheme;
      return newTheme;
    });
  }, []);

  // Apply theme on mount and changes
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Modal Management
  const openModal = useCallback((modalName) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: true,
    }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  const toggleModal = useCallback((modalName) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  }, []);

  // Feed Management
  const updatePost = useCallback((postId, updates) => {
    setFeedPosts((prev) =>
      prev.map((post) => (post._id === postId ? { ...post, ...updates } : post))
    );
  }, []);

  const deletePost = useCallback(
    (postId) => {
      setFeedPosts((prev) => prev.filter((post) => post._id !== postId));
      showNotification("Post deleted successfully", "success");
    },
    [showNotification]
  );

  const addPost = useCallback(
    (newPost) => {
      setFeedPosts((prev) => [newPost, ...prev]);
      showNotification("Post created successfully", "success");
    },
    [showNotification]
  );

  // Connection Management
  const addConnection = useCallback((userId) => {
    setConnections((prev) => [...prev, userId]);
    setConnectionSuggestions((prev) =>
      prev.filter((user) => user._id !== userId)
    );
  }, []);

  const removeConnection = useCallback((userId) => {
    setConnections((prev) => prev.filter((id) => id !== userId));
  }, []);

  const updatePendingRequests = useCallback((requests) => {
    setPendingRequests(requests);
    setUnreadCount(requests.length);
  }, []);

  // Job Management
  const toggleSaveJob = useCallback(
    (jobId) => {
      setSavedJobs((prev) => {
        const isSaved = prev.includes(jobId);
        if (isSaved) {
          showNotification("Job removed from saved jobs", "info");
          return prev.filter((id) => id !== jobId);
        } else {
          showNotification("Job saved successfully", "success");
          return [...prev, jobId];
        }
      });
    },
    [showNotification]
  );

  const addAppliedJob = useCallback(
    (jobId) => {
      setAppliedJobs((prev) => [...prev, jobId]);
      showNotification("Application submitted successfully", "success");
    },
    [showNotification]
  );

  // Search Management
  const updateSearchResults = useCallback((results) => {
    setSearchResults(results);
  }, []);

  const updateSearchFilters = useCallback((newFilters) => {
    setSearchFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults({
      users: [],
      jobs: [],
      posts: [],
      companies: [],
    });
    setSearchFilters({
      type: "all",
      location: "",
      industry: "",
      experience: "",
      jobType: "",
      datePosted: "",
    });
  }, []);

  // Loading State Management
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Message Management
  const updateUnreadMessages = useCallback((count) => {
    setUnreadMessages(count);
  }, []);

  const setCurrentConversation = useCallback((conversation) => {
    setActiveConversation(conversation);
  }, []);

  // Reset all state (useful for logout)
  const resetAppState = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setActiveTab("home");
    setSearchQuery("");
    setIsLoading(false);
    setFeedPosts([]);
    setFeedPage(1);
    setHasMorePosts(true);
    setConnections([]);
    setPendingRequests([]);
    setConnectionSuggestions([]);
    setSavedJobs([]);
    setAppliedJobs([]);
    setUnreadMessages(0);
    setActiveConversation(null);
    clearSearch();
  }, [clearSearch]);

  const value = {
    // State
    notifications,
    unreadCount,
    activeTab,
    searchQuery,
    isLoading,
    theme,
    modals,
    feedPosts,
    feedPage,
    hasMorePosts,
    connections,
    pendingRequests,
    connectionSuggestions,
    savedJobs,
    appliedJobs,
    unreadMessages,
    activeConversation,
    searchResults,
    searchFilters,

    // Actions
    showNotification,
    removeNotification,
    clearAllNotifications,
    toggleTheme,
    openModal,
    closeModal,
    toggleModal,
    setActiveTab,
    setSearchQuery,
    startLoading,
    stopLoading,

    // Feed Actions
    updatePost,
    deletePost,
    addPost,
    setFeedPosts,
    setFeedPage,
    setHasMorePosts,

    // Connection Actions
    addConnection,
    removeConnection,
    updatePendingRequests,
    setConnectionSuggestions,

    // Job Actions
    toggleSaveJob,
    addAppliedJob,

    // Search Actions
    updateSearchResults,
    updateSearchFilters,
    clearSearch,

    // Message Actions
    updateUnreadMessages,
    setCurrentConversation,

    // Utility Actions
    resetAppState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
