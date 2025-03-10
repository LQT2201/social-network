"use client";

import React, { useState } from "react";
import SideNav from "./_components/SideNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, ChartBar, NotebookText, Video } from "lucide-react";

import TabPost from "./_components/TabPost";
import CardRecommendation from "./_components/CardRecommendation";
import SuggestedPostCard from "./_components/SuggetedPostCard";
import ListPost from "./_components/ListPost";
import PostModal from "./_components/PostModal";

const HomePage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-2 lg:flex md:hidden sm:hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      <div className="col-span-7 p-1 text-sm">
        <div className="flex justify-between items-center">
          <Avatar className="size-20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>QT</AvatarFallback>
          </Avatar>
          <div className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center">
            <Camera size={35} className="mb-1 text-yellow-orange" />
            <h3 className="font-bold">Photo</h3>
          </div>

          <div className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center">
            <NotebookText size={35} className="mb-1 text-yellow-orange" />
            <h3 className="font-bold">Text</h3>
          </div>

          <div className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center">
            <Video size={35} className="mb-1 text-yellow-orange" />
            <h3 className="font-bold">Video</h3>
          </div>

          <div className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center">
            <ChartBar size={35} className="mb-1 text-yellow-orange" />
            <h3 className="font-bold">Poll</h3>
          </div>
        </div>

        <TabPost />

        <ListPost
          onCommentClick={() => {
            setOpen((prev) => !prev);
          }}
        />
      </div>

      <div className="col-span-3">
        <h2 className="text-xl font-medium text-jet">Recommend for you</h2>
        <CardRecommendation />
        <h2 className="text-xl font-medium text-jet mt-3">
          Check out these blogs
        </h2>
        <SuggestedPostCard />
      </div>
      <PostModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default HomePage;
