import React from "react";
import PostCard from "../../homepage/_components/card-post/CardPost";

import { Skeleton } from "@/components/ui/skeleton";

// Skeleton components
const PostSkeleton = () => (
  <div className="mb-4">
    <div className="flex items-center space-x-4 mb-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
    <Skeleton className="h-64 w-full rounded-lg" />
  </div>
);

const PostListView = ({
  posts,
  isLoading,
  onLike,
  onCommentClick,
  emptyMessage,
  formatPost,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="mb-2">Không có bài viết nào</p>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <PostCard
            post={formatPost(post)}
            onLike={() => onLike(post._id)}
            onCommentClick={() => onCommentClick(post._id)}
          />
        </div>
      ))}
    </div>
  );
};

export default PostListView;
