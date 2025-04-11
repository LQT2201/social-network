"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecommendationCardItem = ({ recommendation, onRemove }) => {
  const [isFollowing, setIsFollowing] = useState(false); // Track follow state

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(recommendation.id);
    }
  };

  return (
    <div className="p-3 bg-white rounded-md flex items-center justify-between">
      <div className="flex items-center">
        <Link href={`/profile/${recommendation._id}`}>
          <Avatar className="w-11 h-11">
            <AvatarImage
              src={recommendation.avatar}
              alt={recommendation.username}
            />
            <AvatarFallback>
              {recommendation.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="ml-3 flex flex-col justify-center">
          <Link href={`/profile/${recommendation._id}`}>
            <p className="text-jet hover:text-d-gray line-clamp-1">
              <b>{recommendation.username}</b>
            </p>
          </Link>
          <p className="line-clamp-1 text-sm">{recommendation.bio}</p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center space-y-1">
        <X
          size={15}
          className="cursor-pointer text-d-gray hover:text-jet"
          onClick={handleRemove}
        />
        <Button
          variant="link"
          className={`text-sm ${
            isFollowing ? "text-yellow-500" : "text-l-yellow"
          } hover:text-yellow-orange`}
          onClick={handleFollowClick}
        >
          {isFollowing ? "Unfollow" : "Visit"}
        </Button>
      </div>
    </div>
  );
};

export default RecommendationCardItem;
