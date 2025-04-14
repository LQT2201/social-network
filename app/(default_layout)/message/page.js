"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import MessageLayout from "./_components/MessageLayout";
import MessageListContainer from "./_components/MessageListContainer";
import ConversationContainer from "./_components/ConversationContainer";
import { useSocket } from "./hooks/useSocket";
import { useMessages } from "./hooks/useMessages";
import { useConversations } from "./hooks/useConversations";

const Page = () => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("Page render count:", renderCount.current);

  const [showUserModal, setShowUserModal] = useState(false);
  const [token, setToken] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);

  // Custom hooks
  const socket = useSocket(token, clientId);
  const { handleSendMessage, handleMarkAsRead } = useMessages(
    socket,
    activeConversation,
    clientId
  );
  useConversations(clientId);

  // Initial setup
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setClientId(localStorage.getItem("x-client-id"));
  }, []);

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
