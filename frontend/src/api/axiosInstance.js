import axios from "axios";
import { getErrorMessage } from "../utils/errorHandling";

// Helper to read CSRF token from cookie
function getCSRFToken() {
  const name = 'csrftoken';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// ✅ NEW: Helper to get authentication token for chatbot API
function getAuthToken() {
  return localStorage.getItem("accessToken");
}

// ===============================================================================
// EXISTING DJANGO API INSTANCE (Keep all your existing functionality)
// ===============================================================================
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000", // ✅ UPDATED: Use env variable
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Request Interceptor (Keep your existing logic)
axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Keep your existing commented token logic for potential future use
    // const token = localStorage.getItem("accessToken");
    // if (token) {
    //   config.headers.Authorization = `Token ${token}`;
    // }

    // ✅ CSRF token for POST/PUT/DELETE
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    // ✅ Don't set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Keep your existing logic + add accessToken cleanup)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request Timeout Error");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    if (error.response?.status === 401) {
      // ✅ UPDATED: Clear frontend state (added accessToken)
      localStorage.removeItem("username");
      localStorage.removeItem("accessToken"); // ✅ NEW: Also clear chatbot token
      localStorage.removeItem("streakData");
      localStorage.removeItem("rewardData");
      localStorage.removeItem("completedChapters");

      // Redirect to login
      window.location.href = "/login";
      return Promise.reject(new Error("Your session has expired. Please log in again."));
    }

    const errorMessage = getErrorMessage(error);
    return Promise.reject(new Error(errorMessage));
  }
);

// File Upload Method (Keep your existing implementation)
axiosInstance.uploadFile = async (url, formData, progressCallback) => {
  try {
    const csrfToken = getCSRFToken();
    const response = await axiosInstance.post(url, formData, {
      timeout: 120000,
      headers: csrfToken ? { "X-CSRFToken": csrfToken } : {},
      onUploadProgress: (progressEvent) => {
        if (progressCallback && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          progressCallback(percentCompleted);
        }
      },
    });
    return response;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      error.friendlyMessage = "Upload timed out. Please try with a smaller image or check your connection.";
    } else if (error.response?.status === 413) {
      error.friendlyMessage = "File too large. Please upload a smaller image.";
    } else {
      error.friendlyMessage = "Error uploading file. Please try again.";
    }
    throw error;
  }
};

// ===============================================================================
// ✅ NEW: STUDENT PERFORMANCE ASSISTANT API INSTANCE
// ===============================================================================
const chatbotAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_STUDENT_ASSISTANT_API_URL || "https://chatbot.smartlearners.ai",
  timeout: 45000, // Longer timeout for AI processing
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

// ✅ NEW: Chatbot API Request Interceptor
chatbotAxiosInstance.interceptors.request.use(
  (config) => {
    // Add Bearer token for authentication
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData (multipart requests)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      // Keep Authorization header for FormData requests
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ NEW: Chatbot API Response Interceptor
chatbotAxiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Chatbot API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error(`❌ Chatbot API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);

    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("AI service is taking too long to respond. Please try again."));
    }

    if (error.response?.status === 401) {
      return Promise.reject(new Error("Authentication failed. Please log in again."));
    }

    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.detail || "Invalid request data.";
      return Promise.reject(new Error(`Validation Error: ${JSON.stringify(validationErrors)}`));
    }

    if (error.response?.status === 429) {
      return Promise.reject(new Error("Too many requests. Please wait a moment and try again."));
    }

    if (error.response?.status >= 500) {
      return Promise.reject(new Error("AI service is temporarily unavailable. Please try again later."));
    }

    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.detail || 
                         error.message || 
                         "An unexpected error occurred.";
    
    return Promise.reject(new Error(errorMessage));
  }
);

// ===============================================================================
// ✅ NEW: CHATBOT API HELPER METHODS
// ===============================================================================

// Health check method
chatbotAxiosInstance.healthCheck = async () => {
  try {
    const response = await chatbotAxiosInstance.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
};

// Get student information
chatbotAxiosInstance.getStudentInfo = async () => {
  try {
    const response = await chatbotAxiosInstance.get('/student-info');
    return response.data;
  } catch (error) {
    console.warn("Could not fetch student info:", error.message);
    return null;
  }
};

// Get curriculum information
chatbotAxiosInstance.getCurriculumInfo = async () => {
  try {
    const response = await chatbotAxiosInstance.get('/curriculum-info');
    return response.data;
  } catch (error) {
    console.warn("Could not fetch curriculum info:", error.message);
    return null;
  }
};

// Get chat history
chatbotAxiosInstance.getChatHistory = async () => {
  try {
    const response = await chatbotAxiosInstance.get('/chat-history');
    return response.data;
  } catch (error) {
    console.warn("Could not load chat history:", error.message);
    return [];
  }
};

// Send text chat message
chatbotAxiosInstance.sendTextMessage = async (query, language = 'en') => {
  try {
    const response = await chatbotAxiosInstance.post('/chat', {
      query,
      language
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

// Send chat message with image
chatbotAxiosInstance.sendImageMessage = async (query, language, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('query', query);
    formData.append('language', language);
    formData.append('image', imageFile);

    const response = await chatbotAxiosInstance.post('/chat', formData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to send image message: ${error.message}`);
  }
};

// Process audio message
chatbotAxiosInstance.processAudio = async (audioFile, language = 'en') => {
  try {
    const formData = new FormData();
    formData.append('language', language);
    formData.append('audio', audioFile);

    const response = await chatbotAxiosInstance.post('/process-audio', formData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to process audio: ${error.message}`);
  }
};

// ===============================================================================
// ✅ NEW: EXPORTS
// ===============================================================================

// Export main instance as default (for existing code compatibility)
export default axiosInstance;

// Export chatbot instance for specific chatbot functionality
export { chatbotAxiosInstance };

// Export helper functions
export { getCSRFToken, getAuthToken };