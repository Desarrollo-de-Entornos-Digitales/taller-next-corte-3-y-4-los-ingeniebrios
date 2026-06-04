import axios from '@/lib/axios/client';

// ─── TIPOS ────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  roleId: number;
  student?: {
    semester: number;
    level: number;
    thanks: number;
    career: { name: string };
  };
}

export interface Post {
  id: number;
  title: string;
  description: string;
  image?: string;
  solved: boolean;
  created_at: string;
  category: { name: string };
  answers: { id: number }[];
}

// ─── SERVICIOS ────────────────────────────────────────────

// Usuario logueado actual
export const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get('/auth/me');
  return response.data;
};

// Posts del usuario
export const getUserPosts = async (userId: number): Promise<Post[]> => {
  const response = await axios.get(`/posts/user/${userId}`);
  return response.data;
};