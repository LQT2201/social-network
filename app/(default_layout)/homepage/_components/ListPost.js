"use client";
import React, { Suspense, useRef, useCallback, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";
import PostSkeleton from "./card-post/PostSkeleton";
import { formatMediaFiles } from "@/utils/mediaFormatter";
import NoMoreRecommendations from "./recommend-section/NoMoreRecommendations";

const CardPost = dynamic(() => import("./card-post/CardPost"), {
  loading: () => <PostSkeleton />,
  ssr: false,
});

const ListPost = ({
  posts = [],
  error,
  onLike,
  onCommentClick,
  onLoadMore,
  hasMore,
}) => {
  const loadingRef = useRef(null);

  // Add intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      {
        root: null,
        // rootMargin: "20px",
        threshold: 0.1,
      }
    );

    const currentLoadingRef = loadingRef.current;

    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [hasMore, onLoadMore]);

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
    avatar: post.author.avatar,
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

      <div ref={loadingRef} className="pt-4">
        {hasMore && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-l-yellow"></div>
          </div>
        )}
      </div>

      {!hasMore && (
        <NoMoreRecommendations title="No More Posts Available For You. Follow More People." />
      )}
    </div>
  );
};

export default ListPost;
