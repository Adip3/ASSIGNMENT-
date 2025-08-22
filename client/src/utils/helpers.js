// src/utils/helpers.js

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin}m`;
  } else if (diffHr < 24) {
    return `${diffHr}h`;
  } else if (diffDays < 7) {
    return `${diffDays}d`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}w`;
  } else if (diffMonths < 12) {
    return `${diffMonths}mo`;
  } else {
    return `${diffYears}y`;
  }
};

/**
 * Format long date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatLongDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return d.toLocaleDateString("en-US", options);
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return d.toLocaleDateString("en-US", options);
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return "";

  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Format number with K, M, B suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (!num) return "0";

  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + "K";
  if (num < 1000000000) return (num / 1000000).toFixed(1) + "M";
  return (num / 1000000000).toFixed(1) + "B";
};

/**
 * Generate slug from text
 * @param {string} text - Text to slugify
 * @returns {string} Slug
 */
export const slugify = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extract domain from email
 * @param {string} email - Email address
 * @returns {string} Domain
 */
export const getEmailDomain = (email) => {
  if (!email || !email.includes("@")) return "";
  return email.split("@")[1];
};

/**
 * Parse query string
 * @param {string} queryString - Query string to parse
 * @returns {object} Parsed query parameters
 */
export const parseQueryString = (queryString) => {
  const params = {};
  const searchParams = new URLSearchParams(queryString);

  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  return params;
};

/**
 * Build query string from object
 * @param {object} params - Parameters object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      searchParams.append(key, params[key]);
    }
  });

  return searchParams.toString();
};

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate reading time
 * @param {string} text - Text content
 * @returns {number} Reading time in minutes
 */
export const calculateReadingTime = (text) => {
  if (!text) return 0;

  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return minutes;
};

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return "";

  const parts = filename.split(".");
  if (parts.length === 1) return "";

  return parts[parts.length - 1].toLowerCase();
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Generate random ID
 * @returns {string} Random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Sort array by property
 * @param {array} array - Array to sort
 * @param {string} property - Property to sort by
 * @param {string} order - Sort order (asc/desc)
 * @returns {array} Sorted array
 */
export const sortByProperty = (array, property, order = "asc") => {
  return [...array].sort((a, b) => {
    if (order === "asc") {
      return a[property] > b[property] ? 1 : -1;
    } else {
      return a[property] < b[property] ? 1 : -1;
    }
  });
};

/**
 * Check if user is online (active in last 5 minutes)
 * @param {string|Date} lastSeen - Last seen timestamp
 * @returns {boolean} Is online
 */
export const isUserOnline = (lastSeen) => {
  if (!lastSeen) return false;

  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffMinutes = (now - lastSeenDate) / (1000 * 60);

  return diffMinutes < 5;
};
