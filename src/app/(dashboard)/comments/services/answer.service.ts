
import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";

// Type definition for answer user
export type AnswerUserResponse = {
  id: number;
  name: string;
  avatar: string | null;
  student?: {
    level: number;
  };
};

// Type definition for answer response
export type AnswerResponse = {
  id: number;
  description: string;
  image: string | null;
  created_at: string;
  user: AnswerUserResponse;
  post: { id: number };
};

// Type definition for creating an answer
export type CreateAnswerDto = {
  description: string;
  image?: string | null;
  postId: number;
};

export type { ApiResult };

// Answer Service - manages all answer API operations
class AnswerService {
  async getAnswersByPost(postId: number): Promise<ApiResult<AnswerResponse[]>> {
    return safeRequest(axiosClient.get<AnswerResponse[]>("/answer"));
  }

  async createAnswer(dto: CreateAnswerDto): Promise<ApiResult<AnswerResponse>> {
    return safeRequest(axiosClient.post<AnswerResponse>("/answer", dto));
  }
}

export const answerService = new AnswerService();