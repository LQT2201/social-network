import React, { memo, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MessageCircle, Heart, ChevronDown, ChevronUp } from "lucide-react";

const CommentItem = memo(({ comment, onReply, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(depth === 0);
  const [isLiked, setIsLiked] = useState(false);
  const hasReplies = comment.replies?.length > 0;
  const maxDepth = 3;

  const toggleReplies = useCallback(() => setShowReplies((prev) => !prev), []);
  const toggleLike = useCallback(() => setIsLiked((prev) => !prev), []);
  const handleReply = useCallback(() => {
    onReply(comment._id, comment.author?.username);
  }, [comment._id, comment.author?.username, onReply]);

  if (depth > maxDepth) {
    return (
      <div className="ml-4 pl-4 border-l border-gray-200 py-2">
        <button
          onClick={handleReply}
          className="text-sm text-blue-600 hover:underline"
        >
          Continue this thread →
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative ${
        depth > 0 ? "ml-4 pl-4 border-l border-gray-200" : ""
      }`}
    >
      <div className="bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author?.avatar} />
            <AvatarFallback>{comment.author?.username?.[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm">
                {comment.author?.username}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>

            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">
              {comment.content}
            </p>

            <div className="flex items-center gap-4 mt-2">
              <button
                className={`flex items-center gap-1 text-xs hover:text-blue-600 transition-colors ${
                  isLiked ? "text-red-500" : "text-gray-500"
                }`}
                onClick={toggleLike}
              >
                <Heart className="h-4 w-4" />
                <span>{comment.likes?.length || 0}</span>
              </button>

              <button
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                onClick={handleReply}
              >
                <MessageCircle className="h-4 w-4" />
                Reply
              </button>

              {hasReplies && (
                <button
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  onClick={toggleReplies}
                >
                  {showReplies ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Hide {comment.replies.length} replies
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show {comment.replies.length} replies
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {hasReplies && showReplies && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
});

const CommentList = memo(
  ({ comments, onReply }) => {
    if (!comments?.length) {
      return (
        <div className="text-center py-4 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} onReply={onReply} />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.comments.length !== nextProps.comments.length) return false;
    return prevProps.comments.every(
      (comment, index) =>
        comment._id === nextProps.comments[index]._id &&
        comment.content === nextProps.comments[index].content &&
        comment.replies?.length === nextProps.comments[index].replies?.length
    );
  }
);

CommentItem.displayName = "CommentItem";
CommentList.displayName = "CommentList";

export default CommentList;
