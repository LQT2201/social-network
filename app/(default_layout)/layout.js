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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${readex_pro.className}`}>
        <header className="w-screen p-2 px-20 flex items-center justify-between ">
          <Image
            className="w-40 h-12"
            src={logo}
            alt="logo image"
            placeholder="empty"
          ></Image>

          <div className=" relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-yellow-orange" />
            <Input type="text" placeholder="Search" className="pl-10" />
          </div>

          <div className="flex gap-5 items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button className="text-jet bg-white border-white shadow-none p-0px">
                    <Send />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Luong Quoc Toan</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Bell />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Luong Quoc Toan</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {" "}
                  <Avatar className="size-8">
                    <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
                    <AvatarFallback>QT</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Luong Quoc Toan</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button className=" rounded-full bg-yellow-orange border border-yellow-orange text-white hover:border-l-yellow t hover:bg-l-yellow">
              Create
            </Button>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
