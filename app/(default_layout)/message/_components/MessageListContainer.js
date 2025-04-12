"use client";
import React from "react";
import MessageList from "./MessageList";

const MessageListContainer = ({ conversations, onlineUsers }) => {
  return (
    <div className="col-span-3 p-2 max-h-[calc(-100px+100vh)] overflow-y-scroll scrollbar-custom">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <MessageList conversations={conversations} onlineUsers={onlineUsers} />
    </div>
  );
};

export default MessageListContainer;
