import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Ellipsis, Pin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector, useDispatch } from "react-redux";
import {
  selectOnlineUsers,
  togglePinConversationAsync,
  isPinnedConversation,
  togglePinConversation,
} from "@/redux/features/message";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const ConversationHeader = ({ conversation }) => {
  const onlineUsers = useSelector(selectOnlineUsers) || [];
  const dispatch = useDispatch();

  // Kiểm tra xem cuộc trò chuyện có được ghim không từ Redux store
  const isPinned = useSelector((state) =>
    isPinnedConversation(state, conversation?._id)
  );

  // Tìm người dùng khác trong cuộc trò chuyện (không phải người dùng hiện tại)
  const otherParticipant = conversation?.participants?.find(
    (participant) => participant?._id !== conversation?.currentUser?._id
  );

  // Kiểm tra trạng thái online
  const isOnline =
    Array.isArray(onlineUsers) &&
    otherParticipant?._id &&
    onlineUsers.includes(otherParticipant._id);

  // Tạo chữ cái đầu cho avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Format thời gian hoạt động cuối
  const getLastActiveTime = () => {
    if (isOnline) return "Đang hoạt động";

    const lastActive = otherParticipant?.lastActive;
    if (!lastActive) return "Một phút trước";

    return `Hoạt động ${formatDistanceToNow(new Date(lastActive), {
      addSuffix: true,
      locale: vi,
    })}`;
  };

  // Hàm xử lý pin/unpin cuộc trò chuyện sử dụng Redux
  const handleTogglePin = () => {
    if (!conversation?._id) return;

    dispatch(togglePinConversation(conversation._id));
    dispatch(togglePinConversationAsync(conversation._id));
  };

  return (
    <div className="flex flex-row gap-2 text-xs items-center border-b pb-2">
      <Avatar className="size-10 relative">
        <Link href={`/profile/${otherParticipant?._id}`}>
          <AvatarImage src={otherParticipant?.avatar} />
          <AvatarFallback>
            {getInitials(otherParticipant?.username)}
          </AvatarFallback>
        </Link>
        {isOnline && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center">
          <Link href={`/profile/${otherParticipant?._id}`}>
            <p className="font-medium">
              {otherParticipant?.username || "Người dùng"}
            </p>
          </Link>
          {isPinned && <Pin className="ml-2 h-3 w-3 text-yellow-orange" />}
        </div>
        <span className="text-d-gray text-[10px]">{getLastActiveTime()}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <Ellipsis className="text-d-gray hover:text-gray-800" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleTogglePin}>
            <Pin className="mr-2 h-4 w-4" />
            {isPinned ? "Bỏ ghim cuộc trò chuyện" : "Ghim cuộc trò chuyện"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ConversationHeader;
