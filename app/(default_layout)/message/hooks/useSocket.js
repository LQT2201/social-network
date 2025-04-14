import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import {
  setOnlineUsers,
  updateUserStatus,
  markAsRead,
} from "@/redux/features/message";

export const useSocket = (token, clientId) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

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

    // Handle initial online users
    const handleOnlineUsers = (users) => {
      console.log("Online users received from socket:", users);
      dispatch(setOnlineUsers(users));
    };

    // Handle user status changes
    const handleUserStatus = ({ userId, isOnline }) => {
      console.log(`User ${userId} is ${isOnline ? "online" : "offline"}`);
      dispatch(updateUserStatus({ userId, isOnline }));
    };

    // Handle message read status
    const handleMessageRead = ({ userId, conversationId }) => {
      dispatch(markAsRead({ userId, conversationId }));
    };

    // Handle connection events
    const handleConnect = () => {
      console.log("Socket connected");
      // Emit user online status when connected
      newSocket.emit("userOnline", { userId: clientId });
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      // Emit user offline status when disconnected
      newSocket.emit("userOffline", { userId: clientId });
    };

    // Socket event listeners
    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("onlineUsers", handleOnlineUsers);
    newSocket.on("userStatus", handleUserStatus);
    newSocket.on("markAsRead", handleMessageRead);

    return () => {
      // Cleanup on unmount
      newSocket.emit("userOffline", { userId: clientId });
      newSocket.disconnect();
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("onlineUsers", handleOnlineUsers);
      newSocket.off("userStatus", handleUserStatus);
      newSocket.off("markAsRead", handleMessageRead);
    };
  }, [token, clientId, dispatch]);

  return socket;
};
