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
  selectMessagesByConversation,
  selectAllConversations,
  selectActiveConversation,
  sendMessage,
  fetchConversations,
  markConversationAsRead,
} from "@/redux/features/messageSlice";
import { Button } from "@/components/ui/button";

const Page = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [token, setToken] = useState(null);
  const [clientId, setClientId] = useState(null);
  const activeConversation = useSelector(selectActiveConversation);
  const messages = useSelector((state) =>
    selectMessagesByConversation(state, activeConversation?._id)
  );

  const onlineUsers = useSelector(selectOnlineUsers);
  const conversations = useSelector(selectAllConversations);

  // Get authentication info only after component mounts on client
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setClientId(localStorage.getItem("x-client-id"));
    dispatch(fetchConversations({ page: 1, limit: 20 }));
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!token || !clientId) return;

    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        auth: {
          "x-client-id": clientId,
          authorization: `Bearer ${token}`,
        },
      }
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, clientId]);

  // Handle joining conversation and socket events
  useEffect(() => {
    if (!socket || !activeConversation) return;

    // Join the conversation room
    socket.emit("joinConversation", activeConversation._id);

    // Listen for events
    socket.on("newMessage", ({ conversationId, message }) => {
      dispatch(addMessage({ conversationId, message }));
    });

    socket.on("onlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on("messagesRead", ({ userId, conversationId }) => {
      dispatch(markAsRead({ userId, conversationId }));
    });

    // Cleanup function
    return () => {
      socket.emit("leaveConversation", activeConversation._id);
      socket.off("newMessage");
      socket.off("onlineUsers");
      socket.off("messagesRead");
    };
  }, [socket, dispatch, activeConversation]);

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation?._id && clientId) {
      dispatch(fetchMessages({ conversationId: activeConversation._id }));

      // Đánh dấu đã đọc khi chuyển đến cuộc trò chuyện mới
      dispatch(
        markConversationAsRead({
          conversationId: activeConversation._id,
          userId: clientId,
        })
      );
    }
  }, [activeConversation?._id, dispatch, clientId]);

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

    dispatch(sendMessage({ conversationId: activeConversation._id, content }));
  };

  const handleMarkAsRead = () => {
    if (!activeConversation?._id || !clientId) return;

    // Gọi API để đánh dấu tin nhắn đã đọc
    dispatch(
      markConversationAsRead({
        conversationId: activeConversation._id,
        userId: clientId,
      })
    );

    // Đồng thời gửi thông báo qua socket
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
        <MessageList conversations={conversations} onlineUsers={onlineUsers} />
      </div>

      <div className="col-span-7 p-2">
        <div className="bg-white rounded-md p-2 flex flex-col h-[calc(-110px+100vh)]">
          <ConversationHeader conversation={activeConversation} />

          <div className="flex-1 overflow-y-auto" onScroll={handleMarkAsRead}>
            <ConversationMessages
              messages={messages}
              currentUserId={clientId}
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
