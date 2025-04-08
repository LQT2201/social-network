"use client";
import React from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecommendationCardItem = ({ recommendation }) => {
  return (
    <div className="p-3 my-2 bg-white rounded-md flex text-xs justify-center items-center">
      <Link href="/">
        <Avatar className="size-11">
          <AvatarImage src={recommendation.avatar} />
          <AvatarFallback>{recommendation.avatarFallback}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-3/5 mx-3">
        <p className="text-jet hover:text-d-gray">
          <b>{recommendation.username}</b>
        </p>
        <p className="line-clamp-1">{recommendation.description}</p>
      </div>
      <div className="justify-center items-end flex flex-col">
        <X size={15} className="cursor-pointer text-d-gray hover:text-jet" />
        <p className="text-l-yellow hover:text-yellow-orange cursor-pointer">
          Follow
        </p>
      </div>
    </div>
  );
};

export default RecommendationCardItem;
