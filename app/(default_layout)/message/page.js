"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  updateUserStatus,
  fetchPinnedConversations,
  markMessagesAsRead,
} from "@/redux/features/message";
import { Button } from "@/components/ui/button";

const Page = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [token, setToken] = useState(null);
  const [clientId, setClientId] = useState(null);
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("Page render count:", renderCount.current);

  // Selectors
  const activeConversation = useSelector(selectActiveConversation);
  const messages = useSelector((state) =>
    selectMessagesByConversation(state, activeConversation?._id)
  );
  const onlineUsers = useSelector(selectOnlineUsers);
  const conversations = useSelector(selectAllConversations);

  // Xử lý gửi tin nhắn
  const handleSendMessage = useCallback(
    (content) => {
      if (!socket || !activeConversation?._id) return;

      // Gửi tin nhắn qua socket
      socket.emit("sendMessage", {
        conversationId: activeConversation._id,
        content,
      });

      // Cập nhật store Redux
      dispatch(
        sendMessage({
          conversationId: activeConversation._id,
          content,
        })
      );
    },
    [socket, activeConversation, dispatch]
  );

  // Đánh dấu tin nhắn đã đọc
  const handleMarkAsRead = useCallback(() => {
    if (!activeConversation?._id || !clientId) return;

    const conversationId = activeConversation._id;

    // Đồng thời gửi thông báo qua socket
    if (socket) {
      socket.emit("markAsRead", {
        conversationId: activeConversation._id,
      });
    }

    dispatch(markMessagesAsRead({ conversationId, userId: clientId }));

    // Gọi API để đánh dấu tin nhắn đã đọc
    dispatch(
      markConversationAsRead({
        conversationId,
        userId: clientId,
      })
    );
  }, [activeConversation, clientId, dispatch, socket]);

  // Khởi tạo thông tin xác thực
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setClientId(localStorage.getItem("x-client-id"));
    dispatch(fetchConversations({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Khởi tạo kết nối socket
  useEffect(() => {
    if (!token || !clientId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    const newSocket = io(socketUrl, {
      auth: {
        "x-client-id": clientId,
        authorization: `Bearer ${token}`,
      },
    });

    setSocket(newSocket);

    // Lắng nghe sự kiện onlineUsers và userStatus ngay khi kết nối
    const handleOnlineUsers = (users) => {
      console.log("Online users received from socket:", users);
      dispatch(setOnlineUsers(users));
    };

    const handleUserStatus = ({ userId, isOnline }) => {
      console.log(`User ${userId} is ${isOnline ? "online" : "offline"}`);
      dispatch(updateUserStatus({ userId, isOnline }));
    };

    const handleMessageRead = ({ userId, conversationId }) => {
      dispatch(markAsRead({ userId, conversationId }));
    };

    // Đăng ký các listener cho cập nhật trạng thái người dùng
    newSocket.on("onlineUsers", handleOnlineUsers);
    newSocket.on("userStatus", handleUserStatus);
    newSocket.on("markAsRead", handleMessageRead);

    return () => {
      newSocket.disconnect();
      newSocket.off("onlineUsers", handleOnlineUsers);
      newSocket.off("userStatus", handleUserStatus);
      newSocket.off("markAsRead", handleMessageRead);
    };
  }, [token, clientId, dispatch]);

  // Xử lý tham gia phòng trò chuyện và sự kiện tin nhắn
  useEffect(() => {
    if (!socket || !activeConversation?._id) return;

    // Tham gia phòng trò chuyện
    socket.emit("joinConversation", activeConversation._id);

    // Lắng nghe sự kiện tin nhắn mới
    const handleNewMessage = ({ conversationId, message }) => {
      console.log("newMessage", message);
      dispatch(addMessage({ conversationId, message }));
    };

    // Đăng ký listener cho tin nhắn mới
    socket.on("newMessage", handleNewMessage);

    // Cleanup function
    return () => {
      socket.emit("leaveConversation", activeConversation._id);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch, activeConversation]);

  // Tải tin nhắn khi thay đổi cuộc trò chuyện
  useEffect(() => {
    if (activeConversation?._id && clientId) {
      // Tải tin nhắn cho cuộc trò chuyện
      dispatch(fetchMessages({ conversationId: activeConversation._id }));

      // Đánh dấu đã đọc khi chuyển đến cuộc trò chuyện mới
      dispatch(
        markConversationAsRead({
          conversationId: activeConversation._id,
          userId: clientId,
        })
      );
    }
  }, [activeConversation?._id, clientId, dispatch]);

  // Add this inside the Page component, after the useEffect that fetches regular conversations
  useEffect(() => {
    if (clientId) {
      // Fetch pinned conversations on component mount
      dispatch(fetchPinnedConversations({ page: 1, limit: 20 }));
    }
  }, [clientId, dispatch]);

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
        </div>
        <MessageList conversations={conversations} onlineUsers={onlineUsers} />
      </div>

      <div className="col-span-7 p-2">
        <div className="bg-white rounded-md p-2 flex flex-col h-[calc(-110px+100vh)]">
          {activeConversation?._id ? (
            <>
              <ConversationHeader conversation={activeConversation} />

              <div
                className="flex-1 overflow-y-auto"
                onScroll={handleMarkAsRead}
              >
                <ConversationMessages
                  messages={messages}
                  currentUserId={clientId}
                />
              </div>

              <ConversationInput
                onSendMessage={handleSendMessage}
                disabled={!activeConversation?._id}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="mb-4 text-gray-500">No conversation selected</p>
              <Button variant="outline" onClick={() => setShowUserModal(true)}>
                New Chat
              </Button>
            </div>
          )}
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
