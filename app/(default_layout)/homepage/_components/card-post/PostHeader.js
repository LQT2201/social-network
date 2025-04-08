"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const PostHeader = ({ username, postedAt, avatar, userId }) => (
  <div className="flex items-center p-4">
    <Link href={`/profile/${userId}`}>
      <Avatar>
        <AvatarImage src={avatar || "https://github.com/shadcn.png"} />
        <AvatarFallback>{username?.[0]}</AvatarFallback>
      </Avatar>
    </Link>
    <div className="ml-3 flex items-center justify-between w-full">
      <Link href={`/profile/${userId}`}>
        <h3 className="font-medium">{username}</h3>
      </Link>

      <p className="text-gray-500 text-sm">{postedAt}</p>
    </div>
  </div>
);

export default PostHeader;
