"use client";
import { Button } from "@/components/ui/button";
import { Home, Send, User, Compass, Settings, Footprints } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// Hàm render icon với width và height mặc định
const renderIcon = (IconComponent, width = 24, height = 24) => (
  <IconComponent width={width} height={height} />
);

const SideNav = () => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("x-client-id");
      setUserId(storedId || "");
    }
  }, []);

  // Dữ liệu các liên kết sidebar
  const side_links = [
    { path: "/homepage", name: "Home", icon: renderIcon(Home) },
    { path: `/profile/${userId}`, name: "Profile", icon: renderIcon(User) },
    { path: "/message", name: "Message", icon: renderIcon(Send) },
    { path: "", name: "Explore", icon: renderIcon(Compass) },
    { path: "", name: "Settings", icon: renderIcon(Settings) },
    { path: "/donation", name: "Donation", icon: renderIcon(Footprints) },
  ];

  return (
    <div className="flex flex-col">
      {side_links.map((side_link, index) => (
        <Button
          key={index}
          className="mb-1 w-fit justify-start border-none bg-transparent shadow-none text-jet hover:text-yellow-orange hover:bg-transparent"
        >
          {side_link.icon}
          <Link href={`${side_link.path}`}>
            <span className="ml-2">{side_link.name}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default SideNav;
