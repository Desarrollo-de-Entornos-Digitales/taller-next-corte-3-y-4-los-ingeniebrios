// src/app/(dashboard)/feed/services/posts.service.ts
import axiosClient, { safeRequest } from "@/lib/axios/client";

// 1. Tipamos la estructura exacta que devuelve NestJS (con las relaciones del SQL)
export type PostUserResponse = {
  id: number;
  name: string;
  avatar: string | null;
  student?: {
    level: number;
  };
};

export type PostCategoryResponse = {
  id: number;
  name: string;
};

export type PostResponse = {
  id: number;
  title: string;
  description: string;
  image: string | null;
  solved: boolean;
  created_at: string;
  user: PostUserResponse;
  category: PostCategoryResponse;
};

class PostsService {
  // 2. Envolvemos la petición en safeRequest
  async getPosts() {
    return await safeRequest<PostResponse[]>(
      axiosClient.get("/posts")
    );
  }

  async getCategories() {
    return await safeRequest<PostCategoryResponse[]>(
      axiosClient.get("/categories")
    );
  }
}

export const postsService = new PostsService();