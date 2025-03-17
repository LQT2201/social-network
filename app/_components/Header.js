import "@/app/_styles/global.css";

import Image from "next/image";
import logo from "/images/name.png";
import { Bell, Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input"; // shadcn Input component
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = () => {
  return (
    <header className="w-7xl p-2 px-20 flex items-center justify-between m-auto">
      <Image
        className="w-40 h-12"
        src={logo}
        alt="logo image"
        placeholder="empty"
      />

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-yellow-orange" />
        <Input type="text" placeholder="Search" className="pl-10" />
      </div>

      <div className="flex gap-5 items-center justify-center">
        <Tooltip>
          <TooltipTrigger>
            <Send />
          </TooltipTrigger>
          <TooltipContent>
            <p>Message</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Bell />
          </TooltipTrigger>
          <TooltipContent>
            <p>Notification</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Avatar className="size-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>QT</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>Luong Quoc Toan</p>
          </TooltipContent>
        </Tooltip>

        <Button className="rounded-full bg-yellow-orange border border-yellow-orange text-white hover:border-l-yellow hover:bg-l-yellow">
          Create
        </Button>
      </div>
    </header>
  );
};

export default Header;
