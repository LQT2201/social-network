"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const LikeButton = ({ likes, liked, onLike, size = 24 }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCountAnimating, setIsCountAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setIsCountAnimating(true);
    onLike();
    setTimeout(() => setIsAnimating(false), 1000);
    setTimeout(() => setIsCountAnimating(false), 1000);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        className="relative group"
        aria-label={liked ? "Unlike" : "Like"}
      >
        <Heart
          size={size}
          className={cn(
            "transition-all duration-200",
            liked
              ? "fill-red-500 stroke-red-500"
              : "stroke-gray-700 group-hover:stroke-red-500",
            isAnimating && "animate-like"
          )}
        />
        {isAnimating && (
          <Heart
            size={size}
            className={cn(
              "absolute top-0 left-0",
              "fill-red-500 stroke-red-500",
              "animate-likeRipple"
            )}
          />
        )}
      </button>
      <span
        className={cn(
          "font-medium transition-all duration-200",
          liked && "text-red-500",
          isCountAnimating && "animate-likeCount"
        )}
      >
        {likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}
      </span>
    </div>
  );
};

export default LikeButton;
