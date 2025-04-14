"use client";
import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import ConversationInput from "./ConversationInput";
import SelectUserModal from "./SelectUserModal";
import {
  selectMessagesByConversation,
  selectPagination,
} from "@/redux/features/message";
import { fetchMessages } from "@/redux/features/message";

const ConversationContainer = ({
  activeConversation,
  clientId,
  onMarkAsRead,
  onSendMessage,
  showUserModal,
  setShowUserModal,
}) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) =>
    selectMessagesByConversation(state, activeConversation?._id)
  );
  const pagination = useSelector(selectPagination);
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);
  const prevMessagesLength = useRef(0);

  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(
        fetchMessages({ conversationId: activeConversation._id, page: 1 })
      );
    }
  }, [activeConversation?._id, dispatch]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      // Nếu là tin nhắn mới (tăng số lượng), scroll xuống dưới
      if (messages?.length > prevMessagesLength.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
      // Cập nhật số lượng tin nhắn trước đó
      prevMessagesLength.current = messages?.length || 0;
    }
  }, [messages]);

  const handleScroll = async (e) => {
    const container = e.target;
    if (
      container.scrollTop === 0 &&
      !loading &&
      pagination?.hasMore &&
      activeConversation?._id
    ) {
      setLoading(true);
      const currentScrollHeight = container.scrollHeight;
      const currentScrollTop = container.scrollTop;

      await dispatch(
        fetchMessages({
          conversationId: activeConversation._id,
          page: pagination.page + 1,
        })
      );

      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          const newScrollHeight = messagesContainerRef.current.scrollHeight;
          const scrollDiff = newScrollHeight - currentScrollHeight;
          messagesContainerRef.current.scrollTop =
            currentScrollTop + scrollDiff;
        }
      });

      setLoading(false);
    }
  };

  return (
    <div className="col-span-7 p-2">
      <div className="bg-white rounded-md p-2 flex flex-col h-[calc(-110px+100vh)]">
        {activeConversation?._id ? (
          <>
            <ConversationHeader conversation={activeConversation} />

            <div
              className="flex-1 overflow-y-auto"
              onScroll={(e) => {
                handleScroll(e);
                onMarkAsRead(e);
              }}
              ref={messagesContainerRef}
            >
              {loading && (
                <div className="flex justify-center p-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              )}
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
