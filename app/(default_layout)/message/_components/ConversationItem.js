import React, { memo } from "react";
import MessageItem from "./MessageItem";

const ConversationItem = memo(
  ({
    conversation,
    isActive,
    isPinned,
    onlineUsers,
    currentUserId,
    onSelect,
  }) => {
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

    const isOnline = onlineUsers.includes(conversation.participants?.[0]?._id);

    return (
      <div className="relative group" onClick={() => onSelect(conversation)}>
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
          isOnline={isOnline}
          isPinned={isPinned}
          isActive={isActive}
        />
      </div>
    );
  }
);

ConversationItem.displayName = "ConversationItem";

export default ConversationItem;
