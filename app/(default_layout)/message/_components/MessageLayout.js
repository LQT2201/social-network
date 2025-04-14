"use client";
import React, { memo } from "react";
import SideNav from "@/app/_components/SideNav";

const MessageLayout = memo(({ children }) => {
  return (
    <div className="grid grid-cols-12 gap-4 max-w-full max-h-[calc(-95px+100vh)]">
      <div className="col-span-2 lg:block hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>
      {children}
    </div>
  );
});

export default MessageLayout;
