"use server";

import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";

export type CreateAnswerPayload = {
  content: string;
  postId: number;
  image?: string | null;
};

export type AnswerCreated = {
  id: number;
  content: string;
  image?: string | null;
  postId: number;
};

export async function createAnswerAction(
  payload: CreateAnswerPayload
): Promise<ApiResult<AnswerCreated>> {
  return safeRequest(axiosClient.post<AnswerCreated>("/answer", payload));
}

export async function getAnswersByPostAction(postId: number): Promise<ApiResult<any[]>> {
  const result = await safeRequest(axiosClient.get<any[]>("/answer"));
  if (result.error) return result;
  const filtered = result.data.filter((a: any) =>
    a.post?.id !== undefined ? a.post.id === postId : true
  );
  return { error: false, data: filtered, status: result.status };
}
