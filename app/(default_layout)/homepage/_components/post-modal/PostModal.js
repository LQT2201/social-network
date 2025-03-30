"use client";
import React, { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PostModalLoading from "./PostModalLoading";
import dynamic from "next/dynamic";
import {
  selectActivePost,
  selectActivePostStatus,
  selectActivePostError,
  fetchPostById,
  clearActivePost,
  likePost,
  unlikePost,
} from "@/redux/features/postSlice";
import {
  selectCommentsByPostId,
  selectCommentsStatus,
  selectCommentsError,
  addComment,
  replyComment,
  fetchPostComments,
  clearPostComments,
  selectCommentsPagination,
} from "@/redux/features/commentSlice";
import { toast } from "react-hot-toast";
import ModalCardPost from "@/app/(default_layout)/homepage/_components/post-modal/ModalCardPost";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CommentList = dynamic(() => import("./CommentList"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded-lg" />
      ))}
    </div>
  ),
});

const PostModal = ({ open, setOpen, postId }) => {
  const dispatch = useDispatch();
  const post = useSelector(selectActivePost);
  const postStatus = useSelector(selectActivePostStatus);
  const postError = useSelector(selectActivePostError);

  const comments = useSelector((state) =>
    selectCommentsByPostId(state, postId)
  );
  const pagination = useSelector(selectCommentsPagination);
  const commentsStatus = useSelector(selectCommentsStatus);
  const commentsError = useSelector(selectCommentsError);

  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyToAuthor, setReplyToAuthor] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Add ref for intersection observer
  const loadMoreRef = useRef(null);
  const prevY = useRef(0);

  useEffect(() => {
    if (open && postId) {
      dispatch(fetchPostById(postId));
      dispatch(fetchPostComments({ postId, page: 1 }));
    }
    return () => {
      dispatch(clearActivePost());
      dispatch(clearPostComments(postId));
    };
  }, [open, postId, dispatch]);

  useEffect(() => {
    if (!open) {
      setNewComment("");
      setReplyTo(null);
      setReplyToAuthor("");
    }
  }, [open]);

  // Add intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        const y = firstEntry.boundingClientRect.y;

        if (prevY.current > y && firstEntry.isIntersecting) {
          if (
            commentsStatus !== "loading" &&
            pagination.page < pagination.totalPages
          ) {
            handleLoadMore();
          }
        }

        prevY.current = y;
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [commentsStatus, pagination.page, pagination.totalPages]);

  const organizedComments = useMemo(() => {
    const commentMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      commentMap[comment._id] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) parent.replies.push(commentMap[comment._id]);
      } else {
        rootComments.push(commentMap[comment._id]);
      }
    });

    return rootComments;
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsReplying(true);
      if (replyTo) {
        await dispatch(
          replyComment({
            commentId: replyTo,
            content: newComment.trim(),
          })
        ).unwrap();

        await dispatch(
          fetchPostComments({
            postId,
            page: 1,
          })
        );
      } else {
        await dispatch(
          addComment({
            postId: post._id,
            content: newComment.trim(),
          })
        ).unwrap();
      }

      setNewComment("");
      setReplyTo(null);
      setReplyToAuthor("");
      toast.success(replyTo ? "Đã trả lời bình luận" : "Đã thêm bình luận");
    } catch (error) {
      toast.error(error.message || "Không thể thêm bình luận");
    } finally {
      setIsReplying(false);
    }
  };

  const handleReply = (commentId, authorName) => {
    setReplyTo(commentId);
    setReplyToAuthor(authorName);
    setNewComment(`@${authorName} `);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      dispatch(fetchPostComments({ postId, page: pagination.page + 1 }));
    }
  };

  const onEmojiClick = (emojiObject) => {
    const cursor = document.getElementById("commentInput").selectionStart;
    setNewComment(
      (prev) => prev.slice(0, cursor) + emojiObject.emoji + prev.slice(cursor)
    );
  };

  const handleLike = async () => {
    try {
      if (post?.stats?.likes?.includes(localStorage.getItem("x-client-id"))) {
        await dispatch(unlikePost(post._id)).unwrap();
      } else {
        await dispatch(likePost(post._id)).unwrap();
      }
      // Refetch post to update likes count
      await dispatch(fetchPostById(postId));
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  if (!post) return null;

  const isLoading = postStatus === "loading" || commentsStatus === "loading";
  const error = postError || commentsError;

  console.log("Liked", post?.stats?.likes[0]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Suspense fallback={<PostModalLoading />}>
        <DialogContent className="sm:max-w-[800px] h-[90vh] p-0 flex flex-col overflow-hidden">
          <DialogTitle className="sr-only">Post Details</DialogTitle>
          {error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4 p-4">
                      <div className="h-96 bg-gray-100 rounded-lg" />
                      <div className="h-20 bg-gray-100 rounded-lg" />
                    </div>
                  }
                >
                  <ModalCardPost
                    post={{
                      id: post?._id,
                      username: post?.author.username,
                      postedAt: post?.createdAt,
                      caption: post?.content,
                      likes: post?.stats?.likes?.length || 0,
                      liked: post?.stats?.likes?.some(
                        (like) =>
                          like._id === localStorage.getItem("x-client-id")
                      ),
                      media: post?.media,
                      comments: comments.length,
                      shares: post?.stats?.shares?.length || 0,
                      author: post?.author,
                    }}
                    onLike={handleLike}
                  />
                </Suspense>

                {/* Comments Section */}
                <div className="px-6 py-4">
                  <Separator className="my-4" />
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    Comments
                    <span className="text-gray-500 text-base font-normal">
                      ({comments.length})
                    </span>
                  </h3>

                  <div className="mt-6 space-y-6">
                    <Suspense
                      fallback={
                        <div className="animate-pulse space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="h-20 bg-gray-100 rounded-lg"
                            />
                          ))}
                        </div>
                      }
                    >
                      <CommentList
                        comments={organizedComments}
                        onReply={handleReply}
                      />
                    </Suspense>

                    {commentsStatus === "loading" && (
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}

                    {pagination.page < pagination.totalPages && (
                      <div ref={loadMoreRef} className="h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Fixed Comment Input Section */}
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 shadow-lg">
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <Input
                      id="commentInput"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={
                        replyTo
                          ? `Reply to ${replyToAuthor}`
                          : "Write a comment..."
                      }
                      className="pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                    />
                    <Popover
                      open={showEmojiPicker}
                      onOpenChange={setShowEmojiPicker}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 transition-colors"
                        >
                          <Smile className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-0"
                        align="end"
                        side="top"
                        sideOffset={8}
                      >
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          lazyLoadEmojis={true}
                          searchPlaceholder="Search emoji..."
                          width="100%"
                          height={350}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button
                    onClick={handleAddComment}
                    disabled={isLoading || isReplying || !newComment.trim()}
                    className={`min-w-[80px] ${
                      isLoading || isReplying ? "opacity-50" : ""
                    }`}
                  >
                    {isReplying ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending
                      </span>
                    ) : replyTo ? (
                      "Reply"
                    ) : (
                      "Send"
                    )}
                  </Button>
                  {replyTo && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyToAuthor("");
                        setNewComment("");
                      }}
                      disabled={isLoading}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Suspense>
    </Dialog>
  );
};

export default PostModal;
