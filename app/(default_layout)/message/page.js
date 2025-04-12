"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import MessageLayout from "./_components/MessageLayout";
import MessageListContainer from "./_components/MessageListContainer";
import ConversationContainer from "./_components/ConversationContainer";
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

  // Message handling
  const handleSendMessage = useCallback(
    (content) => {
      if (!socket || !activeConversation?._id) return;

      socket.emit("sendMessage", {
        conversationId: activeConversation._id,
        content,
      });

      dispatch(
        sendMessage({
          conversationId: activeConversation._id,
          content,
        })
      );
    },
    [socket, activeConversation, dispatch]
  );

  const handleMarkAsRead = useCallback(() => {
    if (!activeConversation?._id || !clientId) return;

    const conversationId = activeConversation._id;

    if (socket) {
      socket.emit("markAsRead", {
        conversationId: activeConversation._id,
      });
    }

    dispatch(markMessagesAsRead({ conversationId, userId: clientId }));
    dispatch(
      markConversationAsRead({
        conversationId,
        userId: clientId,
      })
    );
  }, [activeConversation, clientId, dispatch, socket]);

  // Initial setup
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setClientId(localStorage.getItem("x-client-id"));
    dispatch(fetchConversations({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Socket setup
  useEffect(() => {
    if (!token || !clientId) return;

    const socketUrl = process.env.NEXT_PUBLIC_BASE_URL_SOCKET;
    const newSocket = io(socketUrl, {
      auth: {
        "x-client-id": clientId,
        authorization: `Bearer ${token}`,
      },
    });

    setSocket(newSocket);

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

  // Conversation handling
  useEffect(() => {
    if (!socket || !activeConversation?._id) return;

    socket.emit("joinConversation", activeConversation._id);

    const handleNewMessage = ({ conversationId, message }) => {
      console.log("newMessage", message);
      dispatch(addMessage({ conversationId, message }));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveConversation", activeConversation._id);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch, activeConversation]);

  // Message fetching
  useEffect(() => {
    if (activeConversation?._id && clientId) {
      dispatch(fetchMessages({ conversationId: activeConversation._id }));
      dispatch(
        markConversationAsRead({
          conversationId: activeConversation._id,
          userId: clientId,
        })
      );
    }
  }, [activeConversation?._id, clientId, dispatch]);

  // Pinned conversations
  useEffect(() => {
    if (clientId) {
      dispatch(fetchPinnedConversations({ page: 1, limit: 20 }));
    }
  }, [clientId, dispatch]);

  return (
    <MessageLayout>
      <MessageListContainer
        conversations={conversations}
        onlineUsers={onlineUsers}
      />
      <ConversationContainer
        activeConversation={activeConversation}
        messages={messages}
        clientId={clientId}
        onMarkAsRead={handleMarkAsRead}
        onSendMessage={handleSendMessage}
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
      />
    </MessageLayout>
  );
};

export default Page;
