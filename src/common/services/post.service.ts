// src/common/services/post.service.ts
// Agrega getPostById al service que ya tienes

import axiosClient, { ApiResult, safeRequest } from "../../lib/axios/client";
// ⚠️ Ajusta el path de axiosClient si es diferente en tu proyecto

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

export type { ApiResult };

class PostsService {
  async getPosts(): Promise<ApiResult<PostResponse[]>> {
    return safeRequest(axiosClient.get<PostResponse[]>("/posts"));
  }

  // ← NUEVO: usado en la página de comentarios
  async getPostById(id: number): Promise<ApiResult<PostResponse>> {
    return safeRequest(axiosClient.get<PostResponse>(`/posts/${id}`));
  }

  async getCategories(): Promise<ApiResult<PostCategoryResponse[]>> {
    return safeRequest(axiosClient.get<PostCategoryResponse[]>("/categories"));
  }
}

export const postsService = new PostsService();