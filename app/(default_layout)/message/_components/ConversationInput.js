"use client";

import React from "react";
import { Paperclip, Smile } from "lucide-react";

const ConversationInput = () => {
  // Hàm xử lý gửi tin nhắn
  const handleSend = () => {
    alert("Send message!");
    // Gọi API hoặc cập nhật state để gửi tin nhắn
  };

  // Hàm xử lý upload ảnh
  const handleUpload = () => {
    alert("Upload image!");
    // Có thể dùng <input type="file" hidden> hoặc modal
  };

  // Hàm xử lý chèn emoji
  const handleEmoji = () => {
    alert("Open emoji picker!");
    // Tích hợp emoji picker hoặc custom UI
  };

  return (
    <div className="flex items-center gap-2 p-2 border-t">
      {/* Nút upload ảnh */}
      <button
        type="button"
        onClick={handleUpload}
        className="text-d-gray hover:text-black"
      >
        <Paperclip className="h-5 w-5" />
      </button>

      {/* Input nhập tin nhắn */}
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Nút emoji */}
      <button
        type="button"
        onClick={handleEmoji}
        className="text-d-gray hover:text-black"
      >
        <Smile className="h-5 w-5" />
      </button>

      {/* Nút gửi tin nhắn */}
      <button
        type="button"
        onClick={handleSend}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
      >
        Send
      </button>
    </div>
  );
};

export default ConversationInput;
