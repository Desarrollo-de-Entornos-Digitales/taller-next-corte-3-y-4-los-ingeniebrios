"use server";

import { postsService, CreatePostDto } from "../../../common/services/post.service";

export async function createPostAction(payload: CreatePostDto) {
  const result = await postsService.createPost(payload);

  if (result.error) {
    return { error: true, message: result.message };
  }

  return { error: false };
}