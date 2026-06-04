import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Career {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  semester: number;
  level: number;
  thanks: number;
  friends: number;
  career: Career | null;
}

export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  student: Student | null;
}

export interface Post {
  id: number;
  title: string;
  image?: string;
  answers?: any[];
}


export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const getUserPosts = async (userId: number): Promise<Post[]> => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
};