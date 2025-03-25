"use client";
import React from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2 } from "lucide-react";

const CardPost = ({ post, onLike, onCommentClick }) => {
  const { username, postedAt, caption, likes, liked, image, comments, shares } =
    post;

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      {/* Header */}
      <div className="flex items-center p-4">
        {/* <Image
          src={`/avatars/${username}.jpg`}
          alt={username}
          width={40}
          height={40}
          className="rounded-full"
          fallback="/avatars/default.jpg"
        /> */}
        <div className="ml-3 flex items-center justify-between w-full">
          <h3 className="font-medium">{username}</h3>
          <p className="text-gray-500 text-sm">{postedAt}</p>
        </div>
      </div>

      {/* Content */}
      <p className="px-4 mb-4">{caption}</p>

      {/* Media */}
      {image && (
        <div className="relative aspect-video w-full">
          <Image
            sizes="auto"
            src={image}
            alt="Post media"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center p-4 border-t">
        <button
          onClick={onLike}
          className={`flex items-center mr-6 flex-1 ${
            liked ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
          <span className="ml-2">{likes}</span>
        </button>

        <button
          onClick={onCommentClick}
          className="flex items-center mr-6 text-gray-600"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="ml-2">{comments.length}</span>
        </button>

        <button className="flex items-center text-gray-600">
          <Share2 className="w-6 h-6" />
          <span className="ml-2">{shares}</span>
        </button>
      </div>
    </div>
  );
};

export default CardPost;
