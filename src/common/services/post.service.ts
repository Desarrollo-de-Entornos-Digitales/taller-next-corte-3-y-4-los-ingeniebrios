// src/common/services/post.service.ts
// Post Service - handles all post-related API operations

import axiosClient, { ApiResult, safeRequest } from "../../lib/axios/client";

// Type definition for post author (user information)
export type PostUserResponse = {
  id: number;
  name: string;
  avatar: string | null;
  student?: {
    level: number;
  };
};

// Type definition for post category
export type PostCategoryResponse = {
  id: number;
  name: string;
};

// Type definition for a complete post object
export type PostResponse = {
  id: number;
  title: string;
  description: string;
  image: string | null;
  solved: boolean;
  createdAt: string;
  user: PostUserResponse;
  category: PostCategoryResponse;
  answers?: { id: number }[];
};

// Data Transfer Object for creating a new post
export type CreatePostDto = {
  title: string;
  description: string;
  categoryId: number;
  facultyId: number;
  image?: string | null;
  userId: number;
};

export type { ApiResult };

// Posts Service - manages all post API operations
class PostsService {
  // Retrieve all posts from the API
  async getPosts(): Promise<ApiResult<PostResponse[]>> {
    return safeRequest(axiosClient.get<PostResponse[]>("/posts"));
  }

  // Get a specific post by ID - used in comments page
  async getPostById(id: number): Promise<ApiResult<PostResponse>> {
    return safeRequest(axiosClient.get<PostResponse>(`/posts/${id}`));
  }

  // Retrieve all available post categories
  async getCategories(): Promise<ApiResult<PostCategoryResponse[]>> {
    return safeRequest(axiosClient.get<PostCategoryResponse[]>("/categories"));
  }

  // Create a new post with the provided data
  async createPost(payload: CreatePostDto): Promise<ApiResult<PostResponse>> {
    return safeRequest(axiosClient.post<PostResponse>("/posts", payload));
  }
}

export const postsService = new PostsService();