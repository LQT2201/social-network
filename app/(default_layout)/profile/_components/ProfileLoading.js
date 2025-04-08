"use client";
import React from "react";
import SideNav from "../../homepage/_components/SideNav";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileLoading = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-2 lg:block hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-10">
        <Skeleton className="h-60 w-full rounded-t-2xl" />
        <div className="bg-white rounded-xl p-4">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="h-4 w-1/3 mt-4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
      </div>
    </div>
  );
};

export default ProfileLoading;
