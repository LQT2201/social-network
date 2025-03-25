"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  likePost,
  selectAllPosts,
  selectPostStatus,
  selectPostError,
  selectPagination,
} from "@/redux/features/postSlice";
import SideNav from "./_components/SideNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, ChartBar, NotebookText, Video } from "lucide-react";

import TabPost from "./_components/TabPost";
import CardRecommendation from "./_components/CardRecommendation";
import SuggestedPostCard from "./_components/SuggetedPostCard";
import ListPost from "./_components/ListPost";
import PostModal from "./_components/PostModal";
import withAuth from "@/hocs/withAuth";
import CreatePost from "./_components/CreatePost";
import { selectUser } from "@/redux/features/authSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null); // Add this state

  // Redux selectors
  const posts = useSelector(selectAllPosts);
  const status = useSelector(selectPostStatus);
  const error = useSelector(selectPostError);
  const pagination = useSelector(selectPagination);
  const user = useSelector(selectUser);

  // Fetch posts on component mount
  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Handle post like
  const handleLikePost = async (postId) => {
    try {
      await dispatch(likePost(postId)).unwrap();
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // Handle load more posts
  const handleLoadMore = () => {
    if (status !== "loading" && pagination.page < pagination.totalPages) {
      dispatch(
        fetchPosts({
          page: pagination.page + 1,
          limit: 10,
        })
      );
    }
  };

  // Update the comment click handler
  const handleCommentClick = (postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-2 lg:flex md:hidden sm:hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      <div className="col-span-7 p-1 text-sm">
        <CreatePost user={user} />

        <TabPost />

        <ListPost
          posts={posts}
          isLoading={status === "loading"}
          error={error}
          onLike={handleLikePost}
          onCommentClick={handleCommentClick} // Update this
          onLoadMore={handleLoadMore}
          hasMore={pagination.page < pagination.totalPages}
        />
      </div>

      <div className="col-span-3">
        <h2 className="text-xl font-medium text-jet">Recommend for you</h2>
        <CardRecommendation />
        <h2 className="text-xl font-medium text-jet mt-3">
          Check out these blogs
        </h2>
        <SuggestedPostCard />
      </div>
      <PostModal
        open={open}
        setOpen={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setSelectedPostId(null); // Clear selected post when modal closes
        }}
        postId={selectedPostId}
      />
    </div>
  );
};

export default withAuth(HomePage);
