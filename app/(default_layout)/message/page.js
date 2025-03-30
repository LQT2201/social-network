"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import SideNav from "@/app/(default_layout)/homepage/_components/SideNav";
import MessageList from "./_components/MessageList";
import ConversationHeader from "./_components/ConversationHeader";
import ConversationMessages from "./_components/ConversationMessages";
import ConversationInput from "./_components/ConversationInput";
import SelectUserModal from "./_components/SelectUserModal";
import {
  fetchMessages,
  addMessage,
  markAsRead,
  setOnlineUsers,
  selectOnlineUsers,
} from "@/redux/features/messageSlice";

const Page = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const activeConversation = useSelector(
    (state) => state.messages.activeConversation
  );
  const messages = useSelector(
    (state) =>
      state.messages.messagesByConversation[activeConversation?._id] || []
  );

  const onlineUsers = useSelector(selectOnlineUsers);
  const conversations = useSelector((state) => state.messages.conversations);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      auth: {
        "x-client-id": localStorage.getItem("x-client-id"),
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", ({ conversationId, message }) => {
      dispatch(addMessage({ conversationId, message }));
    });

    socket.on("onlineUsers", (users) => {
      console.log(users, "users");
      dispatch(setOnlineUsers(users));
    });

    socket.on("messagesRead", ({ userId, conversationId }) => {
      dispatch(markAsRead({ userId, conversationId }));
    });

    return () => {
      socket.off("newMessage");
      socket.off("messagesRead");
    };
  }, [socket, dispatch]);

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(fetchMessages(activeConversation._id));
    }
  }, [activeConversation?._id, dispatch]);

  // Show modal when no conversations exist
  useEffect(() => {
    if (conversations.length === 0) {
      setShowUserModal(true);
    }
  }, [conversations]);

  const handleSendMessage = (content) => {
    if (!socket || !activeConversation) return;

    socket.emit("sendMessage", {
      conversationId: activeConversation._id,
      content,
    });
  };

  const handleMarkAsRead = () => {
    if (!activeConversation?._id) return;

    socket.emit("markAsRead", {
      conversationId: activeConversation._id,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 max-w-full max-h-[calc(-95px+100vh)]]">
      <div className="col-span-2 lg:block hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      <div className="col-span-3 p-2 max-h-[calc(-100px+100vh)] overflow-y-scroll scrollbar-custom">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUserModal(true)}
          >
            New Chat
          </Button>
        </div>
        <MessageList onlineUsers={onlineUsers} />
      </div>

      <div className="col-span-7 p-2">
        <div className="bg-white rounded-md p-2 flex flex-col h-[calc(-110px+100vh)]">
          <ConversationHeader conversation={activeConversation} />

          <div className="flex-1 overflow-y-auto" onScroll={handleMarkAsRead}>
            <ConversationMessages
              messages={messages}
              currentUserId={localStorage.getItem("x-client-id")}
            />
          </div>

          <ConversationInput
            onSendMessage={handleSendMessage}
            // disabled={!activeConversation}
          />
        </div>
      </div>

      <SelectUserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
    </div>
  );
};

export default Page;
