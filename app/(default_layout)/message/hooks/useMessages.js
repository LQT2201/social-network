import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  fetchMessages,
  addMessage,
  sendMessage,
  markMessagesAsRead,
  markConversationAsRead,
} from "@/redux/features/message";

export const useMessages = (socket, activeConversation, clientId) => {
  const dispatch = useDispatch();

  const handleSendMessage = useCallback(
    (content) => {
      if (!socket || !activeConversation?._id) return;

      socket.emit("sendMessage", {
        conversationId: activeConversation._id,
        content,
      });

      // dispatch(
      //   sendMessage({
      //     conversationId: activeConversation._id,
      //     content,
      //   })
      // );
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

  useEffect(() => {
    if (!socket || !activeConversation?._id) return;

    socket.emit("joinConversation", activeConversation._id);

    const handleNewMessage = ({ jsObject }) => {
      dispatch(addMessage(jsObject));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveConversation", activeConversation._id);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch, activeConversation]);

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

  return {
    handleSendMessage,
    handleMarkAsRead,
  };
};
