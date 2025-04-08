"use client";
import React, { useState } from "react";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";

const ProfileInfo = ({
  profileUser,
  isOwnProfile,
  handleFollow,
  currentUserId,
}) => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const isFollowing = profileUser?.followers?.includes(currentUserId);

  return (
    <div className="mt-10 flex justify-between items-center px-4">
      <div className="flex-4/5">
        <p className="text-gray-500 text-sm">@{profileUser?.username}</p>
        <h2 className="text-xl font-bold">{profileUser?.fullName}</h2>
        <h2 className="text-gray-600 text-sm mt-1">{profileUser?.bio}</h2>
      </div>
      <div className="flex flex-col gap-2">
        {!isOwnProfile && (
          <Button
            variant={isFollowing ? "outline" : "default"}
            onClick={handleFollow}
            className="flex gap-2 items-center"
          >
            {isFollowing ? (
              <>
                <UserMinus size={15} /> Unfollow
              </>
            ) : (
              <>
                <UserPlus size={15} /> Follow
              </>
            )}
          </Button>
        )}
        <div className="flex flex-row gap-3">
          <div
            className="text-center cursor-pointer"
            onClick={() => setShowFollowers(true)}
          >
            <p className="text-lg font-bold">
              {profileUser?.followers?.length || 0}
            </p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => setShowFollowing(true)}
          >
            <p className="text-lg font-bold">
              {profileUser?.following?.length || 0}
            </p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
        </div>
      </div>
      {showFollowers && (
        <FollowersModal
          profileUser={profileUser}
          showFollowers={showFollowers}
          onClose={() => setShowFollowers(false)}
        />
      )}
      {showFollowing && (
        <FollowingModal
          profileUser={profileUser}
          showFollowing={showFollowing}
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  );
};

export default ProfileInfo;
