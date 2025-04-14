import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import {
  selectPinnedConversations,
  selectAllConversations,
  selectOnlineUsers,
} from "@/redux/features/message";
import ConversationItem from "./ConversationItem";

const MessageList = React.memo(({ onSelectConversation }) => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Selectors
  const conversations = useSelector(selectAllConversations);
  const onlineUsers = useSelector(selectOnlineUsers);
  const pinnedConversations = useSelector(selectPinnedConversations);

  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("MessageList render count:", renderCount.current);

  useEffect(() => {
    setCurrentUserId(localStorage.getItem("x-client-id"));
  }, []);

  const handleSelectConversation = useCallback(
    (conversation) => {
      setActiveConversation(conversation);
      onSelectConversation(conversation);
    },
    [onSelectConversation]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Memoize filtered conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      if (!searchQuery.trim()) return true;
      const participantName = conversation.participants?.[0]?.username || "";
      return participantName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  // Memoize pinned and unpinned conversations
  const { pinnedConvs, unpinnedConvs } = useMemo(() => {
    return {
      pinnedConvs: filteredConversations.filter((conv) =>
        pinnedConversations.includes(conv._id)
      ),
      unpinnedConvs: filteredConversations.filter(
        (conv) => !pinnedConversations.includes(conv._id)
      ),
    };
  }, [filteredConversations, pinnedConversations]);

  if (!conversations || !conversations.length) {
    return (
      <div>
        <h2>
          Messages <span className="text-yellow-orange">(0)</span>
        </h2>
        <div className="relative w-full max-w-sm mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-d-gray" />
          <Input
            type="text"
            placeholder="Search"
            className="rounded-sm bg-white border-none shadow-none pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="py-4 text-center text-gray-500">
          No conversations yet
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>
        Message{" "}
        <span className="text-yellow-orange">({conversations.length})</span>
      </h2>
      <div className="relative w-full max-w-sm mt-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-d-gray" />
        <Input
          type="text"
          placeholder="Search"
          className="rounded-sm bg-white border-none shadow-none pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {filteredConversations.length > 0 ? (
        <>
          {pinnedConvs.length > 0 && (
            <>
              <h3 className="mt-4 font-medium">Pinned</h3>
              <div className="space-y-1">
                {pinnedConvs.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversation}
                    isActive={activeConversation?._id === conversation._id}
                    isPinned={true}
                    onlineUsers={onlineUsers}
                    currentUserId={currentUserId}
                    onSelect={handleSelectConversation}
                  />
                ))}
              </div>
            </>
          )}

          <h3 className="mt-4 font-medium">
            {pinnedConvs.length > 0 ? "All messages" : "Messages"}
          </h3>

          <div className="space-y-1">
            {unpinnedConvs.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isActive={activeConversation?._id === conversation._id}
                isPinned={false}
                onlineUsers={onlineUsers}
                currentUserId={currentUserId}
                onSelect={handleSelectConversation}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="py-4 text-center text-gray-500">
          No matching conversations found
        </div>
      )}
    </div>
  );
});

MessageList.displayName = "MessageList";

export default MessageList;
