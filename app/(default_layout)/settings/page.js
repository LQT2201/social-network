"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import withAuth from "@/hocs/withAuth";
import SideNav from "../homepage/_components/SideNav";
import SettingsTabs from "./_components/SettingsTabs";
import {
  fetchCurrentUser,
  selectUser,
  updateProfile,
} from "@/redux/features/userSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    } else {
      setFormData({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Thông tin cá nhân đã được cập nhật");
    } catch (error) {
      toast.error("Không thể cập nhật thông tin cá nhân");
      console.error("Update profile error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="lg:col-span-2 justify-start lg:flex hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-10 p-4">
        <h1 className="text-2xl font-bold mb-6">Cài đặt tài khoản</h1>
        <SettingsTabs
          user={user}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmitProfile={handleSubmitProfile}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default withAuth(SettingsPage);
