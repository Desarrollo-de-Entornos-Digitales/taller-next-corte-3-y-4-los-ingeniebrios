"use server";

import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";

export type CreateAnswerPayload = {
  content: string;
  postId: number;
};

export type AnswerCreated = {
  id: number;
  content: string;
  postId: number;
};

export async function createAnswerAction(
  payload: CreateAnswerPayload
): Promise<ApiResult<AnswerCreated>> {
  return safeRequest(axiosClient.post<AnswerCreated>("/answer", payload));
}

// ✅ Trae las respuestas de un post — corre en servidor, lee cookie httpOnly
export async function getAnswersByPostAction(postId: number): Promise<ApiResult<any[]>> {
  const result = await safeRequest(axiosClient.get<any[]>("/answer"));

  console.log("RESULT COMPLETO:", JSON.stringify(result, null, 2));
  console.log("FILTRANDO POR postId:", postId);

  if (result.error) return result;
  return {
    error: false,
    data: result.data.filter((a: any) => a.post?.id === postId),
    status: result.status,
  };
}
