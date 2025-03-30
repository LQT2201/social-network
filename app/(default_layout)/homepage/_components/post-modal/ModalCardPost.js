"use client";
import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Heart, Share2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MediaGallery = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Transform media array to match expected format
  const formattedMedia = {
    images: media?.filter((m) => m.type === "image") || [],
    videos: media?.filter((m) => m.type === "video") || [],
  };

  const allMedia = media || [];
  const mediaCount = allMedia.length;

  if (!mediaCount) return null;

  const getLayoutClasses = () => {
    switch (mediaCount) {
      case 1:
        return "grid-cols-1 aspect-[4/3]";
      case 2:
        return "grid-cols-2 aspect-[16/9] gap-1";
      case 3:
        return "grid-cols-2 aspect-[4/3] gap-1";
      case 4:
        return "grid-cols-2 aspect-square gap-1";
      default:
        return "grid-cols-3 aspect-[3/2] gap-1";
    }
  };

  const displayMedia = mediaCount <= 4 ? allMedia : allMedia.slice(0, 4);

  return (
    <div className={`grid ${getLayoutClasses()} p-1`}>
      {displayMedia.map((item, index) => {
        const isVideo = item.type === "video";
        const isLastTile = index === 3 && mediaCount > 4;

        return (
          <div
            key={item._id || index}
            className={`relative overflow-hidden ${
              mediaCount === 3 && index === 2 ? "col-span-2" : ""
            }`}
          >
            {isVideo ? (
              <video
                src={item.url}
                poster={item.thumbnail}
                controls
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={item.url}
                  alt=""
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
                {isLastTile && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xl font-medium">
                      +{mediaCount - 4}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const LikeButton = ({ liked, likes, onLike }) => {
  return (
    <button
      onClick={onLike}
      className={`group flex items-center mr-6 flex-1 ${
        liked ? "text-red-500" : "text-gray-600"
      }`}
    >
      <Heart
        className={`w-6 h-6 transition-all duration-200 ${
          liked
            ? "fill-red-500 scale-110"
            : "group-hover:text-red-500 group-hover:scale-110"
        }`}
      />
      <span
        className={`ml-2 font-medium transition-colors duration-200 ${
          liked ? "text-red-500" : "group-hover:text-red-500"
        }`}
      >
        {likes}
      </span>
    </button>
  );
};

const ModalCardPost = ({ post, onLike }) => {
  const { username, postedAt, caption, likes, liked, comments, shares, media } =
    post;

  console.log("Post data:", liked); // Debugging line

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <Avatar>
          <AvatarImage
            src={post.author?.avatar || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>{username?.[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex items-center justify-between w-full">
          <h3 className="font-medium">{username}</h3>
          <p className="text-gray-500 text-sm">
            {formatDistanceToNow(new Date(postedAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="px-4 mb-4 text-gray-800">{caption}</p>

      {/* Media */}
      <MediaGallery media={media} />

      {/* Actions */}
      <div className="flex items-center p-4 border-t">
        <LikeButton liked={liked} likes={likes} onLike={onLike} />

        <button className="flex items-center text-gray-600 hover:opacity-75 transition-all duration-200">
          <Share2 className="w-6 h-6" />
          <span className="ml-2 font-medium">{shares}</span>
        </button>
      </div>
    </div>
  );
};

export default ModalCardPost;
