import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Pin } from "lucide-react";
import MessageItem from "./MessageItem";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveConversation,
  selectActiveConversation,
  selectPinnedConversations,
  togglePinConversation,
} from "@/redux/features/message";

const MessageList = ({ conversations = [], onlineUsers = [] }) => {
  const dispatch = useDispatch();
  const activeConversation = useSelector(selectActiveConversation);
  const pinnedConversations = useSelector(selectPinnedConversations);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("MessageList render count:", renderCount.current);

  useEffect(() => {
    setCurrentUserId(localStorage.getItem("x-client-id"));
  }, []);

  const handleSelectConversation = (conversation) => {
    dispatch(setActiveConversation(conversation));
  };

  const handleTogglePin = (e, conversationId) => {
    e.stopPropagation(); // Prevent triggering conversation selection
    dispatch(togglePinConversation(conversationId));
  };

  const getUserUnreadCount = (conversation) => {
    const userId = activeConversation?.currentUser?._id || currentUserId;

    if (
      !userId ||
      !conversation?.unreadCount ||
      !Array.isArray(conversation.unreadCount)
    ) {
      return 0;
    }

    const userUnread = conversation.unreadCount.find(
      (item) => item.user === userId
    );
    return userUnread?.count ? Number(userUnread.count) : 0;
  };

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery.trim()) return true;

    const participantName = conversation.participants?.[0]?.username || "";
    return participantName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Separate pinned and unpinned conversations using Redux state
  const pinnedConvs = filteredConversations.filter((conv) =>
    pinnedConversations.includes(conv._id)
  );

  const unpinnedConvs = filteredConversations.filter(
    (conv) => !pinnedConversations.includes(conv._id)
  );

  // Hiển thị khi không có cuộc trò chuyện nào
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="py-4 text-center text-gray-500">
          No conversations yet
        </div>
      </div>
    );
  }

  const ConversationItem = ({ conversation }) => {
    const isPinned = pinnedConversations.includes(conversation._id);

    return (
      <div
        key={conversation._id}
        className="relative group"
        onClick={() => handleSelectConversation(conversation)}
      >
        <MessageItem
          _id={conversation._id}
          username={conversation.participants?.[0]?.username || "Unknown"}
          avatar={conversation.participants?.[0]?.avatar}
          lastMessage={conversation.lastMessage?.content || "No messages yet"}
          time={
            conversation.lastMessage?.createdAt
              ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : ""
          }
          unreadCount={getUserUnreadCount(conversation)}
          isOnline={onlineUsers.includes(conversation.participants?.[0]?._id)}
          isPinned={isPinned}
        />
      </div>
    );
  };

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredConversations.length > 0 ? (
        <>
          {pinnedConvs.length > 0 && (
            <>
              <h3 className="mt-4 font-medium">Pinned</h3>
              <div className="space-y-1">
                {pinnedConvs.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversation}
                  />
                ))}
              </div>
            </>
          )}

          <h3 className="mt-4 font-medium">
            {pinnedConvs.length > 0 ? "All messages" : "Messages"}
          </h3>
          <div className="space-y-1">
            {unpinnedConvs.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="py-4 text-center text-gray-500">
          No matching conversations found
        </div>
      )}
    </div>
  );
};

export default MessageList;
