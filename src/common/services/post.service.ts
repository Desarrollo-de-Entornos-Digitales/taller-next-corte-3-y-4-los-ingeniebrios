// src/app/(dashboard)/feed/services/post.service.ts

import axiosClient, {ApiResult, safeRequest} from "../../lib/axios/client";

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

export type CreatePostDto = {
  title: string;
  description: string;
  categoryId: number;
  facultyId: number;
  image?: string | null;
  userId: number;
};

export type { ApiResult };

class PostsService {
  async getPosts(): Promise<ApiResult<PostResponse[]>> {
    return safeRequest(axiosClient.get<PostResponse[]>("/posts"));
  }

  async getCategories(): Promise<ApiResult<PostCategoryResponse[]>> {
    return safeRequest(axiosClient.get<PostCategoryResponse[]>("/categories"));
  }

  async createPost(payload: CreatePostDto): Promise<ApiResult<PostResponse>> {
    return safeRequest(axiosClient.post<PostResponse>("/posts", payload));
  }
}

export const postsService = new PostsService();