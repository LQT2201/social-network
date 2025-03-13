import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Ellipsis } from "lucide-react";

const ConversationHeader = () => {
  return (
    <div className="flex flex-row gap-2 text-xs items-center border-b pb-2">
      <Avatar className="size-10">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>QT</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">@iatbu</p>
        <span className="text-d-gray text-[10px]">
          Last seen yesterday 2:00 PM
        </span>
      </div>
      <div>
        <Ellipsis className="text-d-gray" />
      </div>
    </div>
  );
};

export default ConversationHeader;
