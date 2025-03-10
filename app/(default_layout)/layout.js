import "@/app/_styles/global.css";
import { Readex_Pro } from "next/font/google";
import Image from "next/image";
import logo from "@/public/images/name.png";
import { Bell, Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input"; // shadcn Input component
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const readex_pro = Readex_Pro({ subsets: ["vietnamese", "latin"] });

export const metadata = {
  title: {
    template: "%s / The Pet",
    default: "Welcome to The Pet",
  },
  description: "The Pet is a social network for pets",
  keywords: "pets, social network, cute animals",
};

// Tách Header thành một component riêng
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${readex_pro.className}`}>
        <TooltipProvider>
          <Header />
          <div className="max-w-screen w-7xl mx-auto px-20 pt-7 bg-baby-powder">
            {" "}
            {children}
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
