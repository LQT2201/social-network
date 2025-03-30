"use client";

import React, { useState } from "react";
import { Paperclip, Smile, Send } from "lucide-react";

const ConversationInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage("");
  };

  const handleUpload = () => {
    alert("Upload image!");
  };

  const handleEmoji = () => {
    alert("Open emoji picker!");
  };

  return (
    <div className="flex items-center gap-2 p-2 border-t">
      <button
        type="button"
        onClick={handleUpload}
        className="text-d-gray hover:text-black"
      >
        <Paperclip className="h-5 w-5" />
      </button>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="button"
        onClick={handleEmoji}
        className="text-d-gray hover:text-black"
      >
        <Smile className="h-5 w-5" />
      </button>

      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ConversationInput;
