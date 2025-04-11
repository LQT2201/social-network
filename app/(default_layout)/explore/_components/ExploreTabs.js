"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExploreTabs = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default ExploreTabs;
