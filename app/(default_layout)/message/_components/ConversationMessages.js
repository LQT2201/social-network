import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Nhận dữ liệu conversation từ props
const ConversationMessages = ({ conversation }) => {
  return (
    <div className="mt-5 flex-1 overflow-y-auto space-y-4">
      {conversation.map((msg) =>
        msg.sender === "user1" ? (
          // Tin nhắn của user1 (bên trái)
          <div key={msg.id} className="flex flex-col space-y-2">
            <div className="flex flex-row gap-2 text-xs items-center">
              <Avatar className="size-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>QT</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">@iatbu</p>
                <span className="text-d-gray text-[10px]">{msg.time}</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="bg-baby-powder py-2 px-4 w-fit rounded-r-lg rounded-bl-lg">
                <p>{msg.text}</p>
              </div>
            </div>
          </div>
        ) : (
          // Tin nhắn của user2 (bên phải)
          <div key={msg.id} className="flex flex-col space-y-2 items-end">
            <div className="flex flex-row gap-2 text-xs items-center justify-end">
              <div className="flex-1 text-right">
                <p className="font-medium">@iatbu</p>
                <span className="text-d-gray text-[10px]">{msg.time}</span>
              </div>
              <Avatar className="size-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>QT</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-sm">
              <div className="bg-baby-powder py-2 px-4 w-fit rounded-r-lg rounded-bl-lg">
                <p>{msg.text}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ConversationMessages;
