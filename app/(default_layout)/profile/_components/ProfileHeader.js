"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { updateProfile } from "@/redux/features/profileSlice";

const ProfileHeader = ({ profileUser, isOwnProfile }) => {
  const dispatch = useDispatch();

  const handleImageUpload = async (file, type) => {
    if (!file) {
      console.warn("No file provided for upload");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF)");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size too large (max 5MB)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(type, file);

      await dispatch(updateProfile(formData)).unwrap();
      toast.success(`${type} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      let errorMessage = `Failed to update ${type}`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="rounded-t-md relative bg-white">
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file, "coverImage");
                }
              }}
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file, "avatar");
                  }
                }}
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
