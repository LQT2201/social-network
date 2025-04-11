"use client";
import { Button } from "@/components/ui/button";
import { Home, Send, User, Compass, Settings, Footprints } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Hàm render icon với width và height mặc định
const renderIcon = (IconComponent, width = 24, height = 24) => (
  <IconComponent width={width} height={height} />
);

const SideNav = () => {
  const [userId, setUserId] = useState("");
  const pathname = usePathname();

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
    { path: "/explore", name: "Explore", icon: renderIcon(Compass) },
    { path: "/settings", name: "Settings", icon: renderIcon(Settings) },
    { path: "/donation", name: "Donation", icon: renderIcon(Footprints) },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {side_links.map((side_link, index) => {
        const isActive = pathname === side_link.path;
        const buttonClass = isActive
          ? "mb-1 w-fit justify-start border-none bg-transparent shadow-none text-yellow-orange font-medium hover:bg-transparent"
          : "mb-1 w-fit justify-start border-none bg-transparent shadow-none text-jet hover:text-yellow-orange hover:bg-transparent";

        return (
          <Button key={index} className={buttonClass}>
            {side_link.icon}
            <Link href={`${side_link.path}`}>
              <span className="ml-2">{side_link.name}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

export default SideNav;
