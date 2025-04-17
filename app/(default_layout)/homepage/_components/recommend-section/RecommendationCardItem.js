"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  followUser,
  unfollowUser,
  selectFollowing,
} from "@/redux/features/profileSlice";
import { toast } from "react-hot-toast";

const RecommendationCardItem = ({ recommendation, onRemove }) => {
  const dispatch = useDispatch();
  const following = useSelector(selectFollowing);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already being followed
  useEffect(() => {
    if (
      following &&
      following.some((user) => user._id === recommendation._id)
    ) {
      setIsFollowing(true);
    }
  }, [following, recommendation._id]);

  const handleFollowClick = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(recommendation._id)).unwrap();
        toast.success(`Unfollowed ${recommendation.username}`);
      } else {
        await dispatch(followUser(recommendation._id)).unwrap();
        toast.success(`Following ${recommendation.username}`);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error(`Failed to ${isFollowing ? "unfollow" : "follow"} user`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(recommendation._id);
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
          <p className="line-clamp-1 text-sm text-gray-500">
            {recommendation.bio}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center space-y-1">
        <X
          size={15}
          className="cursor-pointer text-d-gray hover:text-jet transition-colors"
          onClick={handleRemove}
          aria-label="Remove recommendation"
        />
        <Button
          variant="link"
          className={`text-sm ${
            isFollowing ? "text-yellow-500" : "text-l-yellow"
          } hover:text-yellow-orange transition-colors`}
          onClick={handleFollowClick}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </div>
  );
};

export default RecommendationCardItem;
