import axios from "axios";
import { getErrorMessage } from "../utils/errorHandling";

// Helper to read CSRF token from cookie
function getCSRFToken() {
  const name = 'csrftoken';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  console.log("CSRF Token:", match ? match[2] : null); // Debugging line to check CSRF token
  return match ? match[2] : null;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/", // must match backend run host
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Remove token-based Authorization
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

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request Timeout Error");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    if (error.response?.status === 401) {
      // Clear frontend state
      localStorage.removeItem("username");
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

// File Upload Method
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

export default axiosInstance;
