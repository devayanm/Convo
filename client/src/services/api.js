import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Retrieved token for request:", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("No token found in local storage.");
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

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
    const { token } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token successfully generated and stored:", token);
      console.log("Local Storage after storing token:", localStorage.getItem("token"));
    } else {
      console.error("No token received from login response.");
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw handleError(error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMeetings = async () => {
  try {
    const response = await apiClient.get("/api/meetings");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMeetingById = async (meetingId) => {
  try {
    const response = await apiClient.get(`/api/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createMeeting = async (meetingData) => {
  try {
    const response = await apiClient.post("/api/meetings", meetingData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteMeeting = async (meetingId) => {
  try {
    const response = await apiClient.delete(`/api/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateMeeting = async (meetingId, meetingData) => {
  try {
    const response = await apiClient.put(
      `/api/meetings/${meetingId}`,
      meetingData
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createMessage = async (messageData) => {
  try {
    const response = await apiClient.post(
      `/api/messages/${messageData.meeting_id}`,
      messageData
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMessagesForMeeting = async (meetingId) => {
  try {
    const response = await apiClient.get(`/api/messages/${meetingId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
