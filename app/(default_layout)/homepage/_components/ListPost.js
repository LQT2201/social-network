"use client";
import React, { Suspense } from "react";
import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";
import PostSkeleton from "./card-post/PostSkeleton";
import { formatMediaFiles } from "@/utils/mediaFormatter";

const CardPost = dynamic(() => import("./card-post/CardPost"), {
  loading: () => <PostSkeleton />,
  ssr: false,
});

const LoadingPosts = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <PostSkeleton key={`skeleton-${index}`} />
    ))}
  </div>
);

const LoadMoreButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-2 text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
  >
    Tải thêm bài viết
  </button>
);

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
    return (
      <div className="text-red-500 text-center p-4 rounded-lg bg-red-50">
        {error}
      </div>
    );
  }

  const formatPost = (post) => ({
    id: post._id,
    username: post.author.username,
    postedAt: formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
    }),
    caption: post.content,
    like: post.stats.likes,
    likes: post.stats.likes.length,
    liked: post.stats.likes.includes(localStorage.getItem("x-client-id")),
    media: formatMediaFiles(post.media),
    comments: post.stats.comments,
    shares: post.stats.shares.length,
    userId: post.author._id,
  });

  return (
    <div className="space-y-4 mt-4">
      {posts.map((post) => (
        <Suspense key={post._id} fallback={<PostSkeleton />}>
          <CardPost
            post={formatPost(post)}
            onLike={() => onLike(post._id)}
            onCommentClick={() => onCommentClick(post._id)}
          />
        </Suspense>
      ))}

      {isLoading && <LoadingPosts />}

      {hasMore && !isLoading && <LoadMoreButton onClick={onLoadMore} />}
    </div>
  );
};

export default ListPost;
