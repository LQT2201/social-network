"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Camera } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfileHeader = ({
  profileUser,
  isOwnProfile,
  handleImageUpload,
  setShowEditModal,
}) => {
  return (
    <div className="rounded-t-md relative bg-white">
      {isOwnProfile && (
        <div className="absolute top-5 right-5 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditModal(true)}
            className="bg-white/80 hover:bg-white"
          >
            <Settings size={20} />
          </Button>
        </div>
      )}
      <div className="relative">
        <img
          src={profileUser?.coverImage || "/images/default-cover.jpg"}
          alt="Cover Image"
          width="1200"
          height="400"
          className="w-full h-60 object-cover rounded-t-2xl"
          priority="true"
        />
        {isOwnProfile && (
          <label className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full cursor-pointer hover:bg-white">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(e.target.files?.[0], "coverImage")
              }
            />
            <Camera size={20} />
          </label>
        )}
      </div>
      <div className="absolute left-10 -bottom-10">
        <div className="relative">
          <Avatar className="size-28 border-4 border-white shadow-lg">
            <AvatarImage src={profileUser?.avatar} />
            <AvatarFallback>
              {profileUser?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOwnProfile && (
            <label className="absolute bottom-0 right-0 bg-white/80 p-2 rounded-full cursor-pointer hover:bg-white">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e.target.files?.[0], "avatar")
                }
              />
              <Camera size={20} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
