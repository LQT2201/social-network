import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MessageItem from "./MessageItem";

const MessageList = () => {
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

  const allMessages = [
    {
      id: 1,
      username: "@itabu",
      snippet: "You must be gay bro abc xyz",
      time: "09:02 PM",
    },
    {
      id: 2,
      username: "@itabu",
      snippet: "You must be gay bro abc xyz",
      time: "09:02 PM",
    },
    {
      id: 3,
      username: "@itabu",
      snippet: "You must be gay bro abc xyz",
      time: "09:02 PM",
    },
    {
      id: 4,
      username: "@itabu",
      snippet: "You must be gay bro abc xyz",
      time: "09:02 PM",
    },
    {
      id: 5,
      username: "@itabu",
      snippet: "You must be gay bro abc xyz",
      time: "09:02 PM",
    },
    {
      id: 6,
      username: "@itabu",
      snippet: "You must be gay bro abc xyz",
      time: "09:02 PM",
    },
  ];

  return (
    <div>
      <h2>
        Message <span className="text-yellow-orange">(3)</span>
      </h2>
      <div className="relative w-full max-w-sm mt-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-d-gray" />
        <Input
          type="text"
          placeholder="Search"
          className="rounded-sm bg-white border-none shadow-none pl-10"
        />
      </div>
      <h3 className="mt-2">Pinned</h3>
      {pinnedMessages.map((msg) => (
        <MessageItem key={msg.id} {...msg} />
      ))}
      <h3 className="mt-2">All messages</h3>
      {allMessages.map((msg) => (
        <MessageItem key={msg.id} {...msg} />
      ))}
    </div>
  );
};

export default MessageList;
