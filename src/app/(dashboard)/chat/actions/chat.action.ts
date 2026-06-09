"use server";

import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";

// Type definition for current user
export type CurrentUser = {
  id: number;
  name: string;
  avatar: string | null;
  student?: { level: number };
};

// Type definition for message response
export type MessageResponse = {
  id: number;
  content: string;
  createdAt: string;
  sender: { id: number; name: string; avatar: string | null };
  receiver: { id: number; name: string; avatar: string | null };
};

// Type definition for friend user
export type FriendUser = {
  id: number;
  name: string;
  avatar: string | null;
  student?: { level: number };
};

// Get current authenticated user
export async function getCurrentUserAction(): Promise<ApiResult<CurrentUser>> {
  return safeRequest(axiosClient.get<CurrentUser>("/users/me"));
}

// Get conversation between two users
export async function getConversationAction(
  user1: number,
  user2: number
): Promise<ApiResult<MessageResponse[]>> {
  return safeRequest(
    axiosClient.get<MessageResponse[]>(`/message/conversation/${user1}/${user2}`)
  );
}

// Get all messages for current user
export async function getAllMessagesAction(): Promise<ApiResult<MessageResponse[]>> {
  return safeRequest(axiosClient.get<MessageResponse[]>("/message"));
}

// Send a message to another user
export async function sendMessageAction(
  content: string,
  senderId: number,
  receiverId: number
): Promise<ApiResult<MessageResponse>> {
  return safeRequest(
    axiosClient.post<MessageResponse>("/message", { content, senderId, receiverId })
  );
}

// Get friends list for a user
export async function getFriendsAction(userId: number): Promise<ApiResult<FriendUser[]>> {
  return safeRequest(axiosClient.get<FriendUser[]>(`/friends/user/${userId}`));
}

// Get all monitors
export async function getMonitorsAction(): Promise<ApiResult<any[]>> {
  return safeRequest(axiosClient.get<any[]>("/monitors"));
}

// Get all students
export async function getStudentsAction(): Promise<ApiResult<any[]>> {
  return safeRequest(axiosClient.get<any[]>("/students"));
}
