"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import MessageLayout from "./_components/MessageLayout";
import MessageListContainer from "./_components/MessageListContainer";
import ConversationContainer from "./_components/ConversationContainer";
import { useSocket } from "./hooks/useSocket";
import { useConversations } from "./hooks/useConversations";

const Page = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);

  // Use the combined hook
  const { socket, clientId, handleSendMessage, handleMarkAsRead } =
    useSocket(activeConversation);

  // Call useConversations with clientId
  useConversations(clientId);

  const handleSelectConversation = useCallback((conversation) => {
    setActiveConversation(conversation);
  }, []);

  return (
    <MessageLayout>
      <MessageListContainer onSelectConversation={handleSelectConversation} />
      <ConversationContainer
        activeConversation={activeConversation}
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
