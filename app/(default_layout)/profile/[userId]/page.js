"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SideNav from "../../homepage/_components/SideNav";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  fetchProfile,
  followUser,
  unfollowUser,
  selectProfile,
  updateFollowers,
  selectFollowing,
  getFollowingUsers,
} from "@/redux/features/profileSlice";
import { toast } from "react-hot-toast";
import ProfileHeader from "../_components/ProfileHeader";
import ProfileInfo from "../_components/ProfileInfo";
import ProfileTabs from "../_components/ProfileTabs";
import ProfileLoading from "../_components/ProfileLoading";
import CardRecommendation from "../../homepage/_components/recommend-section/CardRecommendation";

const ProfilePage = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const { userId: viewedUserId } = React.use(params);

  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const profileUser = useSelector(selectProfile);

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
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-row mt-4">
          <div className="flex-2/3">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex-1/3 pl-4">
            <h2 className="font-bold text-xl mt-4">Recommendation for you</h2>
            <CardRecommendation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
