"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import ConversationInput from "./ConversationInput";
import SelectUserModal from "./SelectUserModal";

const ConversationContainer = ({
  activeConversation,
  messages,
  clientId,
  onMarkAsRead,
  onSendMessage,
  showUserModal,
  setShowUserModal,
}) => {
  return (
    <div className="col-span-7 p-2">
      <div className="bg-white rounded-md p-2 flex flex-col h-[calc(-110px+100vh)]">
        {activeConversation?._id ? (
          <>
            <ConversationHeader conversation={activeConversation} />
            <div className="flex-1 overflow-y-auto" onScroll={onMarkAsRead}>
              <ConversationMessages
                messages={messages}
                currentUserId={clientId}
              />
            </div>
            <ConversationInput
              onSendMessage={onSendMessage}
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
      <SelectUserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
    </div>
  );
};

export default ConversationContainer;
