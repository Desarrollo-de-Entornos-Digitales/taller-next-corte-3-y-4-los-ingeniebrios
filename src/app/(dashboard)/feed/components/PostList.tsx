"use client";

import PostCard from "./PostCard";
import { mockPosts } from "../../../../util/post.util";

interface PostListProps {
  selectedCategory: string;
}

export default function PostList({
  selectedCategory,
}: PostListProps) {

  const filteredPosts =
    selectedCategory === "All categories"
      ? mockPosts
      : mockPosts.filter(
          (post) => post.category === selectedCategory
        );

  return (
    <div className="w-full max-w-[850px] flex flex-col gap-4">

      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}

    </div>
  );
}