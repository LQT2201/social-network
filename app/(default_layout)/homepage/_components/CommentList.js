import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LikeButton from "./LikeButton";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const CommentItem = ({ comment, onReply, onLike }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(
    comment.likes?.includes(localStorage.getItem("x-client-id")) || false
  );
  const hasReplies =
    Array.isArray(comment.replies) && comment.replies.length > 0;

  // Handle like button click: toggle local state and notify parent
  const handleLike = () => {
    setLiked((prev) => !prev);
    if (onLike) {
      onLike(comment._id, !liked); // Pass comment ID and new like state to parent
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        {/* Comment content with heart icon overlay */}
        <div className="relative bg-white rounded-lg px-4 py-3 shadow-sm flex">
          <Avatar>
            <AvatarImage
              src={comment.author?.avatar || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>
              {comment.author?.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1">
            <p className="font-semibold text-sm">
              {comment.author?.username || "Unknown"}
            </p>
            <p className="text-gray-700 text-sm">{comment.content || ""}</p>
          </div>
          <div className="cursor-pointer">
            <LikeButton liked={liked} onClick={handleLike} />
          </div>
        </div>

        {/* Time, likes, and reply toggle */}
        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3 ml-1">
          <span className="text-l-gray">
            {comment.createdAt
              ? formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })
              : "Unknown time"}
          </span>
          <span className="text-l-gray">
            {comment.likes?.length || 0} likes
          </span>
          <button
            className="focus:outline-none hover:underline text-d-gray"
            onClick={() =>
              onReply(comment._id, comment.author?.username || "Unknown")
            }
            aria-label={`Reply to ${comment.author?.username || "comment"}`}
          >
            Reply
          </button>
        </div>

        {/* Show/Hide replies button */}
        {hasReplies && (
          <button
            className="focus:outline-none hover:underline text-d-gray text-sm ml-4 mt-2"
            onClick={() => setShowReplies((prev) => !prev)}
            aria-expanded={showReplies}
            aria-label={showReplies ? "Hide replies" : "Show replies"}
          >
            {showReplies
              ? "Hide replies"
              : `Show replies (${comment.replies.length})`}
          </button>
        )}

        {/* Nested replies with indentation */}
        {hasReplies && showReplies && (
          <div className="mt-3 space-y-4 pl-5 border-l border-gray-200">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentList = ({ comments, onReply, onLike }) => {
  return (
    <div className="space-y-5">
      {Array.isArray(comments) &&
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onReply={onReply}
            onLike={onLike}
          />
        ))}
    </div>
  );
};

export default CommentList;
