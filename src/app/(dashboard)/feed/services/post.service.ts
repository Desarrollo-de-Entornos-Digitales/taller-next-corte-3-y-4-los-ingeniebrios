// src/app/(dashboard)/feed/services/post.service.ts

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

export type ApiResult<T> =
  | { error: false; data: T; status: number }
  | { error: true; message: string; status?: number };

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function clientRequest<T>(path: string): Promise<ApiResult<T>> {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      return { error: true, message: `Error ${res.status}`, status: res.status };
    }

    const data = await res.json();
    return { error: false, data, status: res.status };
  } catch (e) {
    return { error: true, message: "Error de conexión" };
  }
}

class PostsService {
  async getPosts(): Promise<ApiResult<PostResponse[]>> {
    return clientRequest<PostResponse[]>("/posts");
  }

  async getCategories(): Promise<ApiResult<PostCategoryResponse[]>> {
    return clientRequest<PostCategoryResponse[]>("/categories");
  }
}

export const postsService = new PostsService();