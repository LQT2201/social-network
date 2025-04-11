import React from "react";
import Image from "next/image";
import { Heart, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MediaGridSkeleton = () => (
  <div className="grid grid-cols-3 gap-1 md:gap-2">
    {Array(9)
      .fill(0)
      .map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-md" />
      ))}
  </div>
);

const PostGridView = ({ posts, onPostClick, isLoading }) => {
  if (isLoading) {
    return <MediaGridSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Không có bài viết nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {posts.map((post) => (
        <div
          key={post._id}
          className="relative aspect-square cursor-pointer overflow-hidden rounded-md group"
          onClick={() => onPostClick(post._id)}
        >
          {post.media && post.media.length > 0 ? (
            <>
              <Image
                src={post.media[0].url}
                alt={post.content || "Post image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="hidden group-hover:flex gap-3 text-white">
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    <span className="text-sm">{post.stats.likes.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    <span className="text-sm">
                      {post.stats.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ImageIcon className="text-gray-400" size={24} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostGridView;
