"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { formatMediaFiles } from "@/utils/mediaFormatter";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchPostsByUser,
  fetchLikedPosts,
  likePost,
} from "@/redux/features/postSlice";
import { toast } from "react-hot-toast";
import PostModal from "../../homepage/_components/post-modal/PostModal";

import ViewModeToggle from "./ViewModeToggle";
import PostListView from "./PostListView";
import PostGridView from "./PostGridView";

// Tab navigation component
const ProfileTabNav = ({
  activeTab,
  setActiveTab,
  viewMode,
  toggleViewMode,
}) => (
  <div className="flex flex-col md:flex-row items-center justify-between mb-6 px-4 py-2 bg-white rounded-lg shadow-md">
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="tabs-list bg-transparent">
        <TabsTrigger value="posts" className="tabs-trigger  ">
          Bài viết
        </TabsTrigger>
        <TabsTrigger value="likes" className="tabs-trigger ">
          Đã thích
        </TabsTrigger>
        <TabsTrigger value="saved" className="tabs-trigger ">
          Đã lưu
        </TabsTrigger>
      </TabsList>
    </Tabs>
    <ViewModeToggle
      viewMode={viewMode}
      toggleViewMode={toggleViewMode}
      className="view-mode-toggle"
    />
  </div>
);

// Data fetching hook
const useProfilePosts = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingLikedPosts, setIsLoadingLikedPosts] = useState(false);

  const fetchUserPosts = async () => {
    if (isLoadingPosts) return;
    setIsLoadingPosts(true);
    try {
      const result = await dispatch(fetchPostsByUser({ userId })).unwrap();
      console.log("User posts result:", result);
      setPosts((result?.posts || result?.metadata?.posts || []).slice());
    } catch (error) {
      toast.error("Không thể tải bài viết");
      console.error("Error loading posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const fetchUserLikedPosts = async () => {
    if (isLoadingLikedPosts) return;
    setIsLoadingLikedPosts(true);
    try {
      const result = await dispatch(fetchLikedPosts({ userId })).unwrap();
      console.log("Liked posts result:", result);
      setLikedPosts((result?.posts || result?.metadata?.posts || []).slice());
    } catch (error) {
      toast.error("Không thể tải bài viết đã thích");
      console.error("Error loading liked posts:", error);
    } finally {
      setIsLoadingLikedPosts(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await dispatch(likePost(postId)).unwrap();
      // Update the post in our local state
      const updatePostLikes = (postsList, setPostsList) => {
        setPostsList(
          postsList.map((post) => {
            if (post._id === postId) {
              const clientId = localStorage.getItem("x-client-id");
              const isLiked = post.stats.likes.includes(clientId);
              return {
                ...post,
                stats: {
                  ...post.stats,
                  likes: isLiked
                    ? post.stats.likes.filter((id) => id !== clientId)
                    : [...post.stats.likes, clientId],
                },
              };
            }
            return post;
          })
        );
      };

      updatePostLikes(posts, setPosts);
      updatePostLikes(likedPosts, setLikedPosts);
    } catch (error) {
      toast.error("Không thể thích bài viết");
    }
  };

  return {
    posts,
    likedPosts,
    isLoadingPosts,
    isLoadingLikedPosts,
    fetchUserPosts,
    fetchUserLikedPosts,
    handleLikePost,
  };
};

// Helper to format post data
const formatPost = (post) => ({
  id: post._id,
  username: post.author.username,
  postedAt: formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  }),
  caption: post.content,
  like: post.stats.likes,
  likes: post.stats.likes.length,
  liked: post.stats.likes.includes(localStorage.getItem("x-client-id")),
  media: formatMediaFiles(post.media),
  comments: post.stats.comments,
  shares: post.stats.shares.length,
  userId: post.author._id,
});

// Main Profile Tabs component
const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { userId } = useParams();

  const {
    posts,
    likedPosts,
    isLoadingPosts,
    isLoadingLikedPosts,
    fetchUserPosts,
    fetchUserLikedPosts,
    handleLikePost,
  } = useProfilePosts();

  // Handle post click to open in modal
  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setModalOpen(true);
  };

  // Handle comment click to open in modal
  const handleCommentClick = (postId) => {
    setSelectedPostId(postId);
    setModalOpen(true);
  };

  // Toggle between grid and list view
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "posts" && posts.length === 0) {
      fetchUserPosts();
    } else if (activeTab === "likes" && likedPosts.length === 0) {
      fetchUserLikedPosts();
    }
  }, [activeTab, userId, posts.length, likedPosts.length]);

  // Render content based on active tab and view mode
  const renderContent = () => {
    if (activeTab === "posts") {
      return viewMode === "grid" ? (
        <PostGridView
          posts={posts}
          onPostClick={handlePostClick}
          isLoading={isLoadingPosts}
        />
      ) : (
        <PostListView
          posts={posts}
          isLoading={isLoadingPosts}
          onLike={handleLikePost}
          onCommentClick={handleCommentClick}
          emptyMessage="Người dùng chưa đăng bài viết nào"
          formatPost={formatPost}
        />
      );
    } else if (activeTab === "likes") {
      return viewMode === "grid" ? (
        <PostGridView
          posts={likedPosts}
          onPostClick={handlePostClick}
          isLoading={isLoadingLikedPosts}
        />
      ) : (
        <PostListView
          posts={likedPosts}
          isLoading={isLoadingLikedPosts}
          onLike={handleLikePost}
          onCommentClick={handleCommentClick}
          emptyMessage="Người dùng chưa thích bài viết nào"
          formatPost={formatPost}
        />
      );
    } else if (activeTab === "saved") {
      return (
        <div className="text-center text-gray-500 py-8">
          <p>Tính năng đang được phát triển</p>
        </div>
      );
    }
  };

  return (
    <div className="mt-4">
      {/* Tab navigation */}
      <ProfileTabNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
      />

      {/* Content area */}
      <div className="border-t pt-4">{renderContent()}</div>

      {/* Post modal */}
      <PostModal
        open={modalOpen}
        setOpen={(isOpen) => {
          setModalOpen(isOpen);
          if (!isOpen) setSelectedPostId(null);
        }}
        postId={selectedPostId}
      />
    </div>
  );
};

export default ProfileTabs;
