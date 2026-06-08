"use server";

import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";

export type CurrentUser = {
  id: number;
  name: string;
  avatar: string | null;
  student?: { level: number };
};

export type MessageResponse = {
  id: number;
  content: string;
  createdAt: string;
  sender: { id: number; name: string; avatar: string | null };
  receiver: { id: number; name: string; avatar: string | null };
};

export type FriendUser = {
  id: number;
  name: string;
  avatar: string | null;
  student?: { level: number };
};

export async function getCurrentUserAction(): Promise<ApiResult<CurrentUser>> {
  return safeRequest(axiosClient.get<CurrentUser>("/users/me"));
}

export async function getConversationAction(
  user1: number,
  user2: number
): Promise<ApiResult<MessageResponse[]>> {
  return safeRequest(
    axiosClient.get<MessageResponse[]>(`/message/conversation/${user1}/${user2}`)
  );
}

export async function getAllMessagesAction(): Promise<ApiResult<MessageResponse[]>> {
  return safeRequest(axiosClient.get<MessageResponse[]>("/message"));
}

export async function sendMessageAction(
  content: string,
  senderId: number,
  receiverId: number
): Promise<ApiResult<MessageResponse>> {
  return safeRequest(
    axiosClient.post<MessageResponse>("/message", { content, senderId, receiverId })
  );
}

export async function getFriendsAction(userId: number): Promise<ApiResult<FriendUser[]>> {
  return safeRequest(axiosClient.get<FriendUser[]>(`/friends/user/${userId}`));
}

export async function getMonitorsAction(): Promise<ApiResult<any[]>> {
  return safeRequest(axiosClient.get<any[]>("/monitors"));
}

export async function getStudentsAction(): Promise<ApiResult<any[]>> {
  return safeRequest(axiosClient.get<any[]>("/students"));
}
