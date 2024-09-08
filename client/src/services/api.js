import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Axios instance with token
const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// API methods
export const registerUser = (userData) => apiClient.post("/register", userData);

export const loginUser = (userData) => apiClient.post("/login", userData);

export const getUserById = (userId) => apiClient.get(`/users/${userId}`);

export const getMeetings = () => apiClient.get("/meetings");

export const getMeetingById = (meetingId) =>
    apiClient.get(`/meetings/${meetingId}`);

export const createMeeting = (meetingData) =>
  apiClient.post("/meetings", meetingData);

export const getMessagesForMeeting = (meetingId) =>
  apiClient.get(`/meetings/${meetingId}/messages`);

export const createMessage = (messageData) =>
  apiClient.post(`/meetings/${messageData.meeting_id}/messages`, messageData);
