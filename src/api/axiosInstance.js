import axios from 'axios';
import { getErrorMessage } from '../utils/errorHandling';

const axiosInstance = axios.create({
  baseURL: 'https://autogen.aieducator.com',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // Increased to 60 seconds for file uploads
});

// Request Interceptor - Adds Authorization Token and handles file uploads
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Token ${token}`;
      console.log("✅ Authorization Token Set:", token);
    }
    
    // Handle FormData content type for file uploads
    if (config.data instanceof FormData) {
      // Don't set Content-Type for FormData - browser will set it with boundary
      delete config.headers['Content-Type'];
      console.log("✅ FormData detected - handling file upload");
    }

    // Log the request for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, 
      config.data instanceof FormData ? "FormData (file upload)" : config.data);
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handles Errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED') {
      console.error("❌ Request Timeout Error", {
        url: error.config?.url,
        message: "Request timed out. This may be due to a large file upload or server processing time."
      });
      
      // Don't redirect for timeouts, just alert the user
      if (error.config?.url?.includes('/anssubmit/')) {
        console.error("File upload timeout. Please try with a smaller file or check your connection.");
      }
    }
    
    // Handle authentication errors (401 Unauthorized)
    else if (error.response?.status === 401) {
      console.error("❌ Authentication Error (401): Invalid or Expired Token");

      // Clear authentication data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      localStorage.removeItem('streakData');
      localStorage.removeItem('rewardData');
      localStorage.removeItem('completedChapters');

      alert("Your session has expired. Please log in again.");
      window.location.href = '/login';
    }

    // Log detailed error response for debugging
    console.error('[API Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message: getErrorMessage(error),
      detail: error.response?.data || error.message
    });

    return Promise.reject(error);
  }
);

// Custom method for file uploads with extended timeout
axiosInstance.uploadFile = async (url, formData, progressCallback) => {
  try {
    const response = await axiosInstance.post(url, formData, {
      timeout: 120000, // 2 minutes for file uploads
      headers: {
        // Don't set Content-Type, axios will set it with the correct boundary
      },
      onUploadProgress: (progressEvent) => {
        if (progressCallback && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progressCallback(percentCompleted);
        }
      }
    });
    return response;
  } catch (error) {
    // Create a more user-friendly error message for file uploads
    if (error.code === 'ECONNABORTED') {
      error.friendlyMessage = "Upload timed out. Please try with a smaller image or check your connection.";
    } else if (error.response?.status === 413) {
      error.friendlyMessage = "File too large. Please upload a smaller image.";
    } else {
      error.friendlyMessage = "Error uploading file. Please try again.";
    }
    throw error;
  }
};

export default axiosInstance;