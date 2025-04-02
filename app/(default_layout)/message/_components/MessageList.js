import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MessageItem from "./MessageItem";
import { useDispatch, useSelector } from "react-redux";
import { setActiveConversation } from "@/redux/features/messageSlice";

const MessageList = ({ conversations = [], onlineUsers = [] }) => {
  const pinnedMessages = [
    {
      id: 1,
      username: "@itabu",
      snippet: "You must be gay bro abc xyz",
      time: "09:02 PM",
      isPinned: true,
    },
    {
      id: 2,
      username: "@itabu",
      snippet: "You must be gay bro abc xyz",
      time: "09:02 PM",
      isPinned: true,
    },
    {
      id: 3,
      username: "@itabu",
      snippet: "You must be gay bro abc xyz",
      time: "09:02 PM",
      isPinned: true,
    },
  ];

  const dispatch = useDispatch();
  const [currentUserId, setCurrentUserId] = useState(null);

  // Access localStorage only on client-side
  useEffect(() => {
    setCurrentUserId(localStorage.getItem("x-client-id"));
  }, []);

  const handleSelectConversation = (conversation) => {
    dispatch(setActiveConversation(conversation));
  };

  // Helper function to get unread count for current user
  const getUserUnreadCount = (conversation) => {
    if (
      !currentUserId ||
      !conversation?.unreadCount ||
      !Array.isArray(conversation.unreadCount)
    ) {
      return 0;
    }

    const userUnread = conversation.unreadCount.find(
      (item) => item.user === currentUserId
    );
    return userUnread?.count ? Number(userUnread.count) : 0;
  };

  // Check if conversations array exists and has items
  if (!conversations || !conversations.length) {
    return (
      <div>
        <h2>
          Messages <span className="text-yellow-orange">(0)</span>
        </h2>
        <div className="relative w-full max-w-sm mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-d-gray" />
          <Input
            type="text"
            placeholder="Search"
            className="rounded-sm bg-white border-none shadow-none pl-10"
          />
        </div>
        <div className="py-4 text-center text-gray-500">
          No conversations yet
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>
        Message{" "}
        <span className="text-yellow-orange">({conversations.length})</span>
      </h2>
      <div className="relative w-full max-w-sm mt-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-d-gray" />
        <Input
          type="text"
          placeholder="Search"
          className="rounded-sm bg-white border-none shadow-none pl-10"
        />
      </div>
      {/* <h3 className="mt-2">Pinned</h3>
      {pinnedMessages.map((msg) => (
        <MessageItem key={msg.id} {...msg} />
      ))} */}
      <h3 className="mt-2">All messages</h3>
      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          onClick={() => handleSelectConversation(conversation)}
        >
          <MessageItem
            _id={conversation._id}
            username={conversation.participants?.[0]?.username || "Unknown"}
            avatar={conversation.participants?.[0]?.avatar}
            lastMessage={conversation.lastMessage?.content || "No messages yet"}
            time={
              conversation.lastMessage?.createdAt
                ? new Date(
                    conversation.lastMessage.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }
            unreadCount={getUserUnreadCount(conversation)}
            isOnline={onlineUsers.includes(conversation.participants?.[0]?._id)}
          />
        </div>
      ))}
    </div>
  );
};

export default MessageList;
