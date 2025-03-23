"use client";

import React, { useState } from "react";
import SideNav from "./_components/SideNav";
import TabPost from "./_components/TabPost";
import CardRecommendation from "./_components/CardRecommendation";
import SuggestedPostCard from "./_components/SuggetedPostCard";
import ListPost from "./_components/ListPost";
import PostModal from "./_components/PostModal";
import CreatePostSection from "./_components/CreatePostSection";
import withAuth from "@/hocs/withAuth";

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
        <CreatePostSection />
        <TabPost />
        <ListPost
          onCommentClick={() => {
            setOpen((prev) => !prev);
          }}
        />
      </div>

      <aside className="col-span-3">
        <h2 className="text-xl font-medium text-jet">Recommend for you</h2>
        <CardRecommendation />
        <h2 className="text-xl font-medium text-jet mt-3">
          Check out these blogs
        </h2>
        <SuggestedPostCard />
      </aside>

      <PostModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default withAuth(HomePage);
