"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SideNav from "../../homepage/_components/SideNav";
import Image from "next/image";
import { Settings, Plus, UserPlus, UserMinus, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  fetchProfile,
  updateProfile,
  followUser,
  unfollowUser,
  selectProfile,
  updateFollowers,
  selectFollowers,
  selectFollowing,
  getFollowingUsers,
} from "@/redux/features/profileSlice";

import { toast } from "react-hot-toast";

import ProfileHeader from "../_components/ProfileHeader";
import ProfileInfo from "../_components/ProfileInfo";
import ProfileTabs from "../_components/ProfileTabs";
import ProfileLoading from "../_components/ProfileLoading";

const ProfilePage = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const { userId: viewedUserId } = React.use(params);

  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const profileUser = useSelector(selectProfile);

  const following = useSelector(selectFollowing);
  const isOwnProfile = loggedInUserId === viewedUserId;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("x-client-id");
      if (!storedId) {
        toast.error("User not authenticated");
        router.push("/login");
      } else {
        setLoggedInUserId(storedId);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!viewedUserId) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(fetchProfile(viewedUserId)).unwrap(),

          dispatch(
            getFollowingUsers({ userId: viewedUserId, page: 1, limit: 10 })
          ).unwrap(),
        ]);
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, viewedUserId]);

  const handleFollow = async () => {
    try {
      const isFollowing = profileUser?.followers?.includes(loggedInUserId);

      if (isFollowing) {
        dispatch(updateFollowers(loggedInUserId));
        await dispatch(unfollowUser(viewedUserId)).unwrap();
        toast.success("Unfollowed successfully");
      } else {
        dispatch(updateFollowers(loggedInUserId));
        await dispatch(followUser(viewedUserId)).unwrap();
        toast.success("Followed successfully");
      }
    } catch (error) {
      toast.error("Failed to update follow status");
      console.error("Error updating follow status:", error);
    }
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append(type, file);
      await dispatch(updateProfile(formData)).unwrap();
      toast.success(`${type} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${type}`);
      console.error(`Error updating ${type}:`, error);
    }
  };

  if (isLoading) {
    return <ProfileLoading />;
  }

  if (!profileUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">User not found</h2>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-2 lg:block hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-10">
        <div className="bg-white rounded-xl pb-4">
          <ProfileHeader
            profileUser={profileUser}
            isOwnProfile={isOwnProfile}
            handleImageUpload={handleImageUpload}
            setShowEditModal={setShowEditModal}
          />

          <ProfileInfo
            profileUser={profileUser}
            isOwnProfile={isOwnProfile}
            handleFollow={handleFollow}
            currentUserId={loggedInUserId}
          />

          {profileUser?.pets?.length > 0 && (
            <div className="m-0 px-4 mt-4">
              <h3 className="text-md font-semibold">
                My Pets{" "}
                <span className="text-d-gray">({profileUser.pets.length})</span>
              </h3>
              <div className="flex space-x-4 mt-3">
                {profileUser.pets.map((pet, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                      <Image
                        src={pet.image || "/images/default-pet.jpg"}
                        alt={pet.name || "Pet"}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-sm mt-1">{pet.name || "Unnamed Pet"}</p>
                  </div>
                ))}
                {isOwnProfile && (
                  <div
                    className="text-center text-d-gray cursor-pointer"
                    onClick={() => setShowAddPetModal(true)}
                  >
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-gray-300 hover:bg-gray-100 transition">
                      <Plus size={20} />
                    </div>
                    <p className="text-xs mt-1">Add pet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
