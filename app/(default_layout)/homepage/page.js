"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  likePost,
  selectAllPosts,
  getFollowingPosts,
  selectPostError,
  selectPagination,
} from "@/redux/features/postSlice";
import SideNav from "../../_components/SideNav";
import TabPost from "./_components/TabPost";
import CardRecommendation from "./_components/recommend-section/CardRecommendation";
import SuggestedPostCard from "./_components/recommend-section/SuggetedPostCard";
import ListPost from "./_components/ListPost";
import PostModal from "./_components/post-modal/PostModal";
import withAuth from "@/hocs/withAuth";
import CreatePost from "./_components/create-post";
import { fetchCurrentUser, selectUser } from "@/redux/features/userSlice";
import { toast } from "react-hot-toast";

const HomePage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Redux selectors
  const posts = useSelector(selectAllPosts);
  const postsError = useSelector(selectPostError);
  const postsPagination = useSelector(selectPagination);
  const user = useSelector(selectUser);

  const hasMore = postsPagination?.page < postsPagination?.total;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await dispatch(fetchPosts({ page: 1, limit: 4 })).unwrap();
        await dispatch(fetchCurrentUser()).unwrap();
      } catch (error) {
        toast.error("Không thể tải dữ liệu");
        console.error("Initial load error:", error);
      }
    };

    loadInitialData();
  }, [dispatch]);

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
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    const params = {
      page: postsPagination.page + 1,
      limit: 4,
    };

    try {
      await dispatch(fetchPosts(params)).unwrap();
    } catch (error) {
      toast.error("Không thể tải thêm bài viết");
      console.error("Load more error:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [dispatch, hasMore, isLoadingMore, postsPagination.page]);

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
      <div className="lg:col-span-2 justify-start lg:flex hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7 p-1 text-sm">
        <CreatePost user={user} />
        <TabPost />
        <ListPost
          posts={posts}
          error={postsError}
          onLike={handleLikePost}
          onCommentClick={handleCommentClick}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>

      <div className="col-span-12 lg:col-span-3">
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
