"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Bell, Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProfileSettings from "./ProfileSettings";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";

const SettingsTabs = ({
  user,
  formData,
  handleInputChange,
  handleSubmitProfile,
  isLoading,
}) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <TabsList className="flex flex-col h-auto p-0 bg-transparent space-y-1">
            <TabsTrigger
              value="profile"
              className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted"
            >
              <User className="h-4 w-4 mr-2" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted"
            >
              <Settings className="h-4 w-4 mr-2" />
              Tài khoản
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted"
            >
              <Bell className="h-4 w-4 mr-2" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted"
            >
              <Lock className="h-4 w-4 mr-2" />
              Bảo mật & Quyền riêng tư
            </TabsTrigger>
            <Separator className="my-2" />
            <Button
              variant="destructive"
              className="justify-start"
              onClick={() => {
                // Implement logout functionality
                toast.success("Đã đăng xuất thành công");
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </TabsList>
        </div>

        <div className="md:w-3/4 space-y-6">
          <TabsContent value="profile" className="m-0">
            <ProfileSettings
              user={user}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmitProfile={handleSubmitProfile}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="account" className="m-0">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="notifications" className="m-0">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="privacy" className="m-0">
            <PrivacySettings />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default SettingsTabs;
