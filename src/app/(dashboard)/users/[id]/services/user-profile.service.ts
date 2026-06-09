import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance for API calls
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add authorization token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const payload = JSON.parse(atob(token!.split(".")[1]));
  console.log(payload);

  return config;
});

// Get user by ID
export const getUserById = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Get posts for a specific user
export const getUserPosts = async (id: number) => {
  const response = await api.get(`/posts/user/${id}`);
  return response.data;
};