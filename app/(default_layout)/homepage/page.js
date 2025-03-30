"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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

import TabPost from "./_components/TabPost";
import CardRecommendation from "./_components/CardRecommendation";
import SuggestedPostCard from "./_components/SuggetedPostCard";
import ListPost from "./_components/ListPost";
import PostModal from "./_components/post-modal/PostModal";
import withAuth from "@/hocs/withAuth";
import CreatePost from "./_components/create-post";
import { fetchCurrentUser, selectUser } from "@/redux/features/userSlice";
import { toast } from "react-hot-toast";

const HomePage = () => {
  // Add render counter
  const renderCount = useRef(0);

  // Log render count
  useEffect(() => {
    renderCount.current += 1;
    console.log(`HomePage rendered ${renderCount.current} times`);
  });

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Redux selectors
  const posts = useSelector(selectAllPosts);
  const status = useSelector(selectPostStatus);
  const error = useSelector(selectPostError);
  const pagination = useSelector(selectPagination);
  const user = useSelector(selectUser);
  const isLoading = status === "loading";

  // Fetch posts on component mount
  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 10 }));
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Handle post like with memo to prevent unnecessary renders
  const handleLikePost = useCallback(
    async (postId) => {
      try {
        await dispatch(likePost(postId)).unwrap();
      } catch (error) {
        toast.error("Không thể thích bài viết");
        console.error("Like error:", error);
      }
    },
    [dispatch]
  );

  // Handle load more posts with memo
  const handleLoadMore = useCallback(() => {
    if (!isLoading && pagination.page < pagination.totalPages) {
      dispatch(
        fetchPosts({
          page: pagination.page + 1,
          limit: 10,
        })
      );
    }
  }, [dispatch, isLoading, pagination.page, pagination.totalPages]);

  // Update the comment click handler with memo
  const handleCommentClick = useCallback((postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback((isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedPostId(null);
    }
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Add render count display for development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full">
          Renders: {renderCount.current}
        </div>
      )}

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
          isLoading={isLoading}
          error={error}
          onLike={handleLikePost}
          onCommentClick={handleCommentClick}
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
        setOpen={handleModalClose}
        postId={selectedPostId}
      />
    </div>
  );
};

export default withAuth(HomePage);
