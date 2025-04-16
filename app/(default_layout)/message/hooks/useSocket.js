import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import {
  setOnlineUsers,
  updateUserStatus,
  markAsRead,
  addMessage,
  sendMessage,
  fetchMessages,
  markMessagesAsRead,
  markConversationAsRead,
} from "@/redux/features/message";

export const useSocket = (activeConversation) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setClientId(localStorage.getItem("x-client-id"));
  }, []);

  useEffect(() => {
    if (!token || !clientId) return;
    const socketUrl = process.env.NEXT_PUBLIC_BASE_URL_SOCKET;
    const newSocket = io(socketUrl, {
      auth: {
        "x-client-id": clientId,
        authorization: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    const handleOnlineUsers = (users) => {
      dispatch(setOnlineUsers(users));
    };
    const handleUserStatus = ({ userId, isOnline }) => {
      dispatch(updateUserStatus({ userId, isOnline }));
    };
    const handleMessageRead = ({ userId, conversationId }) => {
      dispatch(markAsRead({ userId, conversationId }));
    };
    const handleNewMessage = ({ message }) => {
      console.log("message", message);
      dispatch(addMessage(message));
    };
    const handleConnect = () => {
      newSocket.emit("userOnline", { userId: clientId });
    };
    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("onlineUsers", handleOnlineUsers);
    newSocket.on("userStatus", handleUserStatus);
    newSocket.on("markAsRead", handleMessageRead);
    newSocket.on("newMessage", handleNewMessage);

    return () => {
      if (newSocket.connected) {
        newSocket.emit("userOffline", { userId: clientId });
      }
      newSocket.disconnect();
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("onlineUsers", handleOnlineUsers);
      newSocket.off("userStatus", handleUserStatus);
      newSocket.off("markAsRead", handleMessageRead);
      newSocket.off("newMessage", handleNewMessage);
    };
  }, [token, clientId, dispatch]);

  useEffect(() => {
    if (!socket || !activeConversation?._id) return;

    socket.emit("joinConversation", activeConversation._id);

    return () => {
      socket.emit("leaveConversation", activeConversation._id);
    };
  }, [socket, activeConversation]);

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

  const handleSendMessage = useCallback(
    (content) => {
      if (!socket || !activeConversation?._id || !clientId) return;

      socket.emit("sendMessage", {
        conversationId: activeConversation._id,
        content,
      });
    },
    [socket, activeConversation, clientId]
  );

  // Handle marking messages as read
  const handleMarkAsRead = useCallback(() => {
    if (!activeConversation?._id || !clientId || !socket) return;

    const conversationId = activeConversation._id;

    socket.emit("markAsRead", {
      conversationId,
    });

    dispatch(markMessagesAsRead({ conversationId, userId: clientId }));
    dispatch(
      markConversationAsRead({
        conversationId,
        userId: clientId,
      })
    );
  }, [activeConversation, clientId, dispatch, socket]);

  return {
    socket,
    clientId,
    handleSendMessage,
    handleMarkAsRead,
  };
};
