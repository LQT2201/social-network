import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ConversationMessages = ({ messages, currentUserId }) => {
  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${
            message.sender._id === currentUserId
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.sender._id === currentUserId
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            <p>{message.content}</p>
            <div className="flex items-center justify-between mt-1 text-xs opacity-70">
              <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
              {message.isEdited && <span>(edited)</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationMessages;
