"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CardPost from "./CardPost";
import CommentList from "./CommentList";
import {
  selectPostById,
  addComment,
  replyComment,
  fetchComments,
} from "@/redux/features/postSlice";
import { toast } from "react-hot-toast";

const PostModal = ({ open, setOpen, postId }) => {
  const dispatch = useDispatch();
  const post = useSelector((state) => selectPostById(state, postId));
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyToAuthor, setReplyToAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setNewComment("");
      setReplyTo(null);
      setReplyToAuthor("");
    }
  }, [open]);

  if (!post) return null;

  const refreshComments = async () => {
    try {
      await dispatch(fetchComments(postId)).unwrap();
    } catch (error) {
      toast.error("Không thể tải lại bình luận");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      if (replyTo) {
        await dispatch(
          replyComment({
            commentId: replyTo,
            content: newComment.trim(),
          })
        ).unwrap();
      } else {
        await dispatch(
          addComment({
            postId: post._id,
            content: newComment.trim(),
          })
        ).unwrap();
      }

      // Refresh comments after successful reply/comment
      await refreshComments();

      setNewComment("");
      setReplyTo(null);
      setReplyToAuthor("");
      toast.success(replyTo ? "Đã trả lời bình luận" : "Đã thêm bình luận");
    } catch (error) {
      toast.error(error.message || "Không thể thêm bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (commentId, authorName) => {
    setReplyTo(commentId);
    setReplyToAuthor(authorName);
    setNewComment(`@${authorName} `);
  };

  // Organize comments into nested structure
  const organizeComments = (comments) => {
    const commentMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      commentMap[comment._id] = {
        ...comment,
        replies: [],
      };
    });

    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        rootComments.push(commentMap[comment._id]);
      }
    });

    console.log("Root comments:", rootComments);

    return rootComments;
  };

  const comments = organizeComments(post.stats.comments);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[80vh] max-h-[80vh] overflow-y-auto p-0">
        <DialogTitle />
        <CardPost
          post={{
            id: post._id,
            username: post.author.username,
            postedAt: post.createdAt,
            caption: post.content,
            likes: post.stats.likes.length,
            liked: post.stats.likes.includes(
              localStorage.getItem("x-client-id")
            ),
            image: post.media?.[0]?.url,
            comments: post.stats.comments,
            shares: post.stats.shares.length,
          }}
        />
        <div className="grid gap-4">
          <Separator />
          <div className="px-5 py-3">
            <h3>
              Comments{" "}
              <span className="text-gray-500 inline">
                ({post.stats.comments.length})
              </span>
            </h3>

            {/* Add comment input */}
            <div className="flex gap-2 mt-3 mb-4">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  replyTo ? `Reply to ${replyToAuthor}` : "Write a comment..."
                }
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={handleAddComment} disabled={loading}>
                {loading ? "Sending..." : replyTo ? "Reply" : "Send"}
              </Button>
              {replyTo && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyToAuthor("");
                    setNewComment("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="mt-3">
              {loading ? (
                <div className="text-center py-4">Đang tải bình luận...</div>
              ) : (
                <CommentList comments={comments} onReply={handleReply} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
