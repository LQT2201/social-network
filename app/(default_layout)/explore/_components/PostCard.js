"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2 } from "lucide-react";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Link href={`/post/${post.id}`}>
        <div className="relative aspect-square">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Link href={`/profile/${post.author.username}`}>
            <div className="flex items-center space-x-2">
              <Image
                src={post.author.avatar}
                alt={post.author.username}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="font-medium text-sm">
                {post.author.username}
              </span>
            </div>
          </Link>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
        <h3 className="font-semibold mb-2">{post.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {post.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
              <Heart size={16} />
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
              <MessageCircle size={16} />
              <span className="text-sm">{post.comments}</span>
            </button>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
