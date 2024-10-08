import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "https://mocrs-backend.onrender.com/api";
const LIVE_URL = import.meta.env.VITE_LIVE_URL;

// Create an axios instance with default configurations
const apiClient = axios.create({
  baseURL: API_URL || LIVE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set up an interceptor to add the authentication token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mocrsAuthToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Request sent with tk:");
    } else {
      console.log("No token sent.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for handling token expiration
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// Room routes
export const getAllRooms = () => apiClient.get("/rooms");
export const createRoom = (data) => apiClient.post("/rooms", data);
export const updateRoom = (id, data) => apiClient.patch(`/rooms/${id}`, data);
export const getRoom = (id) => apiClient.get(`/rooms/${id}`);
export const deleteRoom = (id) => apiClient.delete(`/rooms/${id}`);
export const joinRoom = (id) => apiClient.post(`/rooms/${id}/join`);
export const leaveRoom = (id) => apiClient.post(`/rooms/${id}/leave`);
export const getPublicRooms = () => apiClient.get("/rooms/public");
export const getPrivateRooms = () => apiClient.get("/rooms/private");
export const getUserRooms = (id) => apiClient.get(`/rooms/user/${id}`);

// User routes
export const loginUser = (data) => apiClient.post("/auth/login", data);
export const getToken = (data) => apiClient.post("/auth/token", data);
export const registerUser = (data) => apiClient.post("/auth/register", data);
export const deleteUser = (username) => apiClient.delete(`/users/${username}`);
export const getUserByUsername = (username) =>
  apiClient.get(`/users/${username}`);
export const updateUser = (username, data) =>
  apiClient.patch(`/users/${username}`, data);

// Jitsi routes
export const createJitsiToken = (data) => apiClient.post("/auth/jtoken", data);
