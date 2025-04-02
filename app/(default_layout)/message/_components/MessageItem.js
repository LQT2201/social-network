import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pin } from "lucide-react";

const MessageItem = ({
  _id,
  username,
  avatar,
  lastMessage,
  time,
  unreadCount = 0,
  isOnline = false,
  isPinned,
}) => {
  // Trích xuất chữ cái đầu tiên của username cho avatar fallback
  const getInitials = () => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white hover:bg-gray-50 rounded-sm flex flex-row p-2 text-sm mt-2 cursor-pointer transition-colors">
      <div className="flex-1/5 relative mr-2">
        <Avatar className="size-10">
          <AvatarImage
            src={avatar || "https://github.com/shadcn.png"}
            alt={username}
          />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white"></span>
        )}
      </div>
      <div className="flex-3/5">
        <p className="line-clamp-1 w-2/3 font-medium">
          {username || "Unknown"}
        </p>
        <p
          className={`line-clamp-1 ${
            unreadCount > 0 ? "text-gray-900 font-medium" : "text-d-gray"
          }`}
        >
          {lastMessage || "No messages"}
        </p>
      </div>
      <div className="flex-1/5 flex flex-col items-end gap-2">
        <span
          className={`text-[10px] ${
            unreadCount > 0 ? "text-gray-900 font-medium" : "text-d-gray"
          }`}
        >
          {time}
        </span>
        {isPinned && (
          <div className="bg-yellow-orange rounded-full p-1">
            <Pin className="size-2.5" />
          </div>
        )}
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
