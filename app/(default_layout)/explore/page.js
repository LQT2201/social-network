"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchPosts,
  selectAllPosts,
  selectPagination,
} from "@/redux/features/postSlice";
import PostModal from "../homepage/_components/post-modal/PostModal";
import SideNav from "../../_components/SideNav";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import withAuth from "@/hocs/withAuth";

const ExplorePage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("for-you");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [open, setOpen] = useState(false);

  const posts = useSelector(selectAllPosts);
  const pagination = useSelector(selectPagination);
  const hasMore = pagination?.page < pagination?.total;

  useEffect(() => {
    const loadInitialPosts = async () => {
      try {
        await dispatch(fetchPosts({ page: 1, limit: 12 })).unwrap();
      } catch (error) {
        toast.error("Không thể tải bài viết");
      }
    };
    loadInitialPosts();
  }, [dispatch]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await dispatch(
        fetchPosts({
          page: pagination.page + 1,
          limit: 12,
        })
      ).unwrap();
    } catch (error) {
      toast.error("Không thể tải thêm bài viết");
    } finally {
      setIsLoadingMore(false);
    }
  }, [dispatch, hasMore, isLoadingMore, pagination?.page]);

  // Intersection Observer to load more posts
  const observerRef = React.useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleLoadMore();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore, isLoadingMore, handleLoadMore]
  );

  const handlePostClick = (post) => {
    setSelectedPost(post._id);
    setOpen(true);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="lg:col-span-2 justify-start lg:flex hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-10 p-1">
        <Tabs defaultValue={activeTab} className="w-full mb-6">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger
              value="for-you"
              onClick={() => setActiveTab("for-you")}
              className="px-4"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              onClick={() => setActiveTab("popular")}
              className="px-4"
            >
              Popular
            </TabsTrigger>
            <TabsTrigger
              value="new"
              onClick={() => setActiveTab("new")}
              className="px-4"
            >
              New
            </TabsTrigger>
            <TabsTrigger
              value="your-tags"
              onClick={() => setActiveTab("your-tags")}
              className="px-4"
            >
              Your tags
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {posts.map((post, index) => (
            <div
              key={post._id}
              ref={index === posts.length - 1 ? lastPostRef : null}
              className="break-inside-avoid mb-4 cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              <div className="relative group rounded-lg overflow-hidden">
                {post.media && post.media[0] && (
                  <img
                    src={post.media[0].url}
                    alt={post.content}
                    className="w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <PostModal
        open={open}
        setOpen={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setSelectedPost(null);
        }}
        postId={selectedPost}
      />
    </div>
  );
};

export default withAuth(ExplorePage);
