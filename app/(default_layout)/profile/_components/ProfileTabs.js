"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mt-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-4">
          <div className="text-center text-gray-500">
            Media content coming soon
          </div>
        </TabsContent>
        <TabsContent value="media" className="mt-4">
          <div className="text-center text-gray-500">
            Media content coming soon
          </div>
        </TabsContent>
        <TabsContent value="likes" className="mt-4">
          <div className="text-center text-gray-500">
            Likes content coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
