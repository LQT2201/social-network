"use client";
import React from "react";
import SideNav from "@/app/(default_layout)/homepage/_components/SideNav";
import MessageList from "@/app/(default_layout)/message/_components/MessageList";

// Import các component tách riêng
import ConversationHeader from "@/app/(default_layout)/message/_components/ConversationHeader";
import ConversationMessages from "@/app/(default_layout)/message/_components/ConversationMessages";
import ConversationInput from "@/app/(default_layout)/message/_components/ConversationInput";

// Fake conversation data
const conversation = [
  {
    id: 1,
    sender: "user1",
    text: "Hello, how are you doing?",
    time: "2:00 PM",
  },
  {
    id: 2,
    sender: "user1",
    text: "I'm working on the project, making good progress.",
    time: "2:01 PM",
  },
  {
    id: 3,
    sender: "user2",
    text: "That’s great to hear! Need any help?",
    time: "2:02 PM",
  },
  {
    id: 4,
    sender: "user2",
    text: "I have some free time if you want to collaborate.",
    time: "2:03 PM",
  },
  {
    id: 5,
    sender: "user1",
    text: "Thanks, I might take you up on that offer soon.",
    time: "2:04 PM",
  },
];

const Page = () => {
  return (
    <div className="grid grid-cols-12 gap-4 max-w-full max-h-[calc(-95px+100vh)]]">
      {/* Sidebar */}
      <div className="col-span-2 lg:block hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      {/* Messages Section */}
      <div className="col-span-3 p-2  max-h-[calc(-100px+100vh)] overflow-y-scroll scrollbar-custom">
        <MessageList />
      </div>

      {/* Conversation Section */}
      <div className="col-span-7 p-2  ">
        {/* Set container height to viewport height minus header height (e.g., 64px) */}
        <div className="bg-white rounded-md p-2 flex flex-col h-[calc(-110px+100vh)]">
          {/* Header */}
          <ConversationHeader />

          {/* Conversation Messages */}
          <div className="flex-1 overflow-y-auto">
            <ConversationMessages conversation={conversation} />
          </div>

          {/* Conversation Input */}
          <ConversationInput />
        </div>
      </div>
    </div>
  );
};

export default Page;
