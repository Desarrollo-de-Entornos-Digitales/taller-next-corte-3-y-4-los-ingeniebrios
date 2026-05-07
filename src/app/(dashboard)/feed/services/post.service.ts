// services/posts.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getPosts = async () => {
  const response = await api.get("/posts");
  
  return response.data.map((post: any) => ({
    id: String(post.id),
    author: {
      name: post.user.name,
      avatar: post.user.avatar || "/default-avatar.png",
      level: post.user.level || "Estudiante", // ✅ El nivel viene del usuario
    },
    content: post.description,
    category: post.category.name,
    image: post.image,
    // ❌ Sin commentsCount
  }));
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};