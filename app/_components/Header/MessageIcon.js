"use client";

import { Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

const MessageIcon = () => {
  const router = useRouter();
  return (
    <Tooltip>
      <TooltipTrigger>
        <Send
          onClick={() => router.push("/message")}
          className="cursor-pointer"
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>Message</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default MessageIcon;
