"use server";

import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";

// Type definition for creating an answer payload
export type CreateAnswerPayload = {
  content: string;
  postId: number;
  image?: string | null;
};

// Type definition for answer response
export type AnswerCreated = {
  id: number;
  content: string;
  image?: string | null;
  postId: number;
};

// Server Action for creating an answer to a post
export async function createAnswerAction(
  payload: CreateAnswerPayload
): Promise<ApiResult<AnswerCreated>> {
  return safeRequest(axiosClient.post<AnswerCreated>("/answer", payload));
}

// Server Action for retrieving answers for a specific post
export async function getAnswersByPostAction(postId: number): Promise<ApiResult<any[]>> {
  const result = await safeRequest(axiosClient.get<any[]>("/answer"));
  if (result.error) return result;
  const filtered = result.data.filter((a: any) =>
    a.post?.id !== undefined ? a.post.id === postId : true
  );
  return { error: false, data: filtered, status: result.status };
}
