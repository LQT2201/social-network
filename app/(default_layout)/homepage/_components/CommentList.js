import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LikeButton from "./LikeButton";

const CommentItem = ({ comment }) => {
  // State to toggle replies visibility
  const [showReplies, setShowReplies] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;
  // Local liked state for this comment
  const [liked, setLiked] = useState(comment.liked);

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        {/* Comment content with heart icon overlay */}
        <div className="relative bg-white rounded-lg px-4 py-3 shadow-sm flex">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1">
            <p className="font-semibold text-sm">{comment.author}</p>
            <p className="text-gray-700 text-sm">{comment.content}</p>
          </div>
          <div className="cursor-pointer">
            <LikeButton
              liked={liked}
              onClick={() => setLiked((prev) => !prev)}
            />
          </div>
        </div>

        {/* Time, likes, and reply toggle */}
        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3 ml-1">
          <span className="text-l-gray">{comment.time || "2 days"}</span>
          <span className="text-l-gray">{comment.likes || "3 likes"}</span>
          <button className="focus:outline-none hover:underline text-d-gray">
            Reply
          </button>
        </div>

        {hasReplies && (
          <button
            className="focus:outline-none hover:underline text-d-gray text-sm ml-4"
            onClick={() => setShowReplies((prev) => !prev)}
          >
            {showReplies ? "Hide replies" : "Show replies"}
          </button>
        )}

        {/* Render replies if available */}
        {hasReplies && showReplies && (
          <div className="mt-3 space-y-4 pl-5 border-l border-gray-200">
            {comment.replies.map((rep) => (
              <CommentItem key={rep.id} comment={rep} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentList = ({ comments }) => {
  return (
    <div className="space-y-5">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
