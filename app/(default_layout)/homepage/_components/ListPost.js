"use client";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import CardPost from "./CardPost";
// import LoadingSpinner from "@/components/ui/loading-spinner";

const ListPost = ({
  posts = [],
  isLoading,
  error,
  onLike,
  onCommentClick,
  onLoadMore,
  hasMore,
}) => {
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (isLoading && posts.length === 0) {
    return <div className="text-center p-4">Đang tải...</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <CardPost
          key={post._id}
          post={{
            id: post._id,
            username: post.author.username,
            postedAt: formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            }),
            caption: post.content,
            likes: post.stats.likes.length,
            liked: post.stats.likes.includes(post.currentUserId),
            image: post.media?.[0]?.url,
            comments: post.stats.comments,
            shares: post.stats.shares.length,
          }}
          onLike={() => onLike(post._id)}
          onCommentClick={() => onCommentClick(post._id)}
        />
      ))}

      {isLoading && posts.length > 0 && (
        <div className="text-center p-4">
          <div>Đang tải...</div>
        </div>
      )}

      {hasMore && !isLoading && (
        <button
          onClick={onLoadMore}
          className="w-full py-2 text-blue-600 hover:bg-gray-50 rounded-md"
        >
          Tải thêm bài viết
        </button>
      )}
    </div>
  );
};

export default ListPost;
