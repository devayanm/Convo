import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Log request details
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Log request details
    console.info("Sending request:", {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Handle errors and log them
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
    console.info("Registering user with data:", userData);
    const response = await apiClient.post("/register", userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const loginUser = async (userData) => {
  try {
    console.info("Logging in user with data:", userData);
    const response = await apiClient.post("/login", userData);
    const { token } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      console.info("Login successful, token stored.");
    } else {
      console.error("No token received from login response.");
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUserById = async (userId) => {
  try {
    console.info("Fetching user with ID:", userId);
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMeetings = async () => {
  try {
    console.info("Fetching meetings.");
    const response = await apiClient.get("/api/meetings");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createMeeting = async (meetingData) => {
  try {
    console.info("Creating meeting with data:", meetingData);
    const response = await apiClient.post("/api/meetings", meetingData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMeetingById = async (id) => {
  try {
    console.info("Fetching meeting with ID:", id);
    const response = await apiClient.get(`/api/meetings/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteMeeting = async (meetingId) => {
  try {
    console.info("Deleting meeting with ID:", meetingId);
    const response = await apiClient.delete(`/api/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateMeeting = async (meetingId, meetingData) => {
  try {
    console.info(
      "Updating meeting with ID:",
      meetingId,
      "and data:",
      meetingData
    );
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
    console.info("Creating message with data:", messageData);
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
    console.info("Fetching messages for meeting with ID:", meetingId);
    const response = await apiClient.get(`/api/messages/${meetingId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
