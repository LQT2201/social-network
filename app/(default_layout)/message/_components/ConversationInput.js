"use client";

import React, { memo, useCallback, useState, useRef } from "react";
import { Paperclip, Smile, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ConversationInput = memo(({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const handleSend = useCallback(() => {
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage("");
    inputRef.current?.focus();
  }, [message, disabled, onSendMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleUpload = useCallback(() => {
    // Implement file upload logic
    alert("Upload file");
  }, []);

  const handleEmoji = useCallback(() => {
    // Implement emoji picker
    alert("Open emoji picker");
  }, []);

  return (
    <div className="flex items-center gap-2 p-2 border-t">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleUpload}
        disabled={disabled}
        className="text-d-gray hover:text-black"
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1"
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={handleEmoji}
        disabled={disabled}
        className="text-d-gray hover:text-black"
      >
        <Smile className="h-5 w-5" />
      </Button>

      <Button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        size="icon"
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
});

ConversationInput.displayName = "ConversationInput";

export default ConversationInput;
