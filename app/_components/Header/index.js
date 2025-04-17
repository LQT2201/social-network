"use client";

import "@/app/_styles/global.css";
import Image from "next/image";
import logo from "@/public/images/name.PNG";
import SearchBar from "./SearchBar";
import MessageIcon from "./MessageIcon";
import NotificationDropdown from "./NotificationDropdown";
import UserAvatar from "./UserAvatar";
import CreateButton from "./CreateButton";

const Header = () => {
  return (
    <header className="w-7xl p-2 px-20 flex items-center justify-between m-auto">
      <Image
        className="w-40 h-12"
        src={logo}
        alt="logo image"
        placeholder="empty"
      />

      <SearchBar />

      <div className="flex gap-5 items-center justify-center">
        <MessageIcon />
        <NotificationDropdown />
        <UserAvatar />
        <CreateButton />
      </div>
    </header>
  );
};

export default Header;
