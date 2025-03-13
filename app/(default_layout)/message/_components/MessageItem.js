import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pin } from "lucide-react";

const MessageItem = ({ username, snippet, time, isPinned }) => {
  return (
    <div className="bg-white rounded-sm flex flex-row p-2 text-sm mt-2">
      <div className="flex-1/5">
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>QT</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-3/5">
        <p className="line-clamp-1 w-2/3">{username}</p>
        <p className="text-d-gray line-clamp-1">{snippet}</p>
      </div>
      <div className="flex-1/5 flex flex-col items-end gap-2">
        <span className="text-d-gray text-[10px]">{time}</span>
        {isPinned && (
          <div className="bg-yellow-orange rounded-full p-1">
            <Pin className="size-2.5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
