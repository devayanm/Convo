import axios from "axios";

// Base API URL depending on the environment (dev, prod)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Axios instance with token and timeout
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Set timeout to 10 seconds
});

// Global retry count limit
const MAX_RETRIES = 2;

// Request interceptor to add authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Refresh token function
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await axios.post(`${API_URL}/refresh-token`, {
      token: refreshToken,
    });
    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Response interceptor to handle errors and token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to token expiration, refresh the token and retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiClient(originalRequest); // Retry the original request with new token
      } else {
        window.location.href = "/login"; // Redirect to login if token refresh fails
        return Promise.reject(error);
      }
    }

    // Retry on network errors or temporary server errors (e.g., 502, 503, 504)
    if (
      error.code === "ECONNABORTED" ||
      [502, 503, 504].includes(error.response?.status)
    ) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      if (originalRequest._retryCount < MAX_RETRIES) {
        originalRequest._retryCount += 1;
        return apiClient(originalRequest); // Retry the request
      }
    }

    return Promise.reject(error); // Reject if it doesn't fit retry conditions
  }
);

// Error handler for better user feedback
const handleError = (error) => {
  if (error.response) {
    console.error(
      `API Error: ${error.response.status} - ${error.response.data.message}`
    );
    return (
      error.response.data.message || "Something went wrong. Please try again."
    );
  } else if (error.request) {
    console.error("No response from the server.");
    return "No response from the server. Please check your connection.";
  } else {
    console.error("Error:", error.message);
    return "Request failed. Please try again.";
  }
};

// API methods
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/register", userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await apiClient.post("/login", userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMeetings = async () => {
  try {
    const response = await apiClient.get("/meetings");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMeetingById = async (meetingId) => {
  try {
    const response = await apiClient.get(`/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createMeeting = async (meetingData) => {
  try {
    const response = await apiClient.post("/meetings", meetingData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteMeeting = async (meetingId) => {
  try {
    const response = await apiClient.delete(`/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMessagesForMeeting = async (meetingId) => {
  try {
    const response = await apiClient.get(`/meetings/${meetingId}/messages`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createMessage = async (messageData) => {
  try {
    const response = await apiClient.post(
      `/meetings/${messageData.meeting_id}/messages`,
      messageData
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
