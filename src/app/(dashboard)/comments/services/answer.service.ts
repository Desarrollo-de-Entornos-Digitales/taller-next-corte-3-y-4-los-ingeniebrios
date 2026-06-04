
import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";

export type AnswerUserResponse = {
  id: number;
  name: string;
  avatar: string | null;
  student?: {
    level: number;
  };
};

export type AnswerResponse = {
  id: number;
  description: string;
  image: string | null;
  created_at: string;
  user: AnswerUserResponse;
  post: { id: number };
};

export type CreateAnswerDto = {
  description: string;
  image?: string | null;
  postId: number;
};

export type { ApiResult };

class AnswerService {
  async getAnswersByPost(postId: number): Promise<ApiResult<AnswerResponse[]>> {
    return safeRequest(axiosClient.get<AnswerResponse[]>("/answer"));
  }

  async createAnswer(dto: CreateAnswerDto): Promise<ApiResult<AnswerResponse>> {
    return safeRequest(axiosClient.post<AnswerResponse>("/answer", dto));
  }
}

export const answerService = new AnswerService();