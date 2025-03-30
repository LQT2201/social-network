"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const PostHeader = ({ username, postedAt, avatar }) => (
  <div className="flex items-center p-4">
    <Avatar>
      <AvatarImage src={avatar || "https://github.com/shadcn.png"} />
      <AvatarFallback>{username?.[0]}</AvatarFallback>
    </Avatar>
    <div className="ml-3 flex items-center justify-between w-full">
      <h3 className="font-medium">{username}</h3>
      <p className="text-gray-500 text-sm">{postedAt}</p>
    </div>
  </div>
);

export default PostHeader;
