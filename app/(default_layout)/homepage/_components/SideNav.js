import { Button } from "@/components/ui/button";
import { Home, Send, User, Compass, Settings, Footprints } from "lucide-react";
import React from "react";

// Hàm render icon với width và height mặc định
const renderIcon = (IconComponent, width = 24, height = 24) => (
  <IconComponent width={width} height={height} />
);

// Dữ liệu các liên kết sidebar
const side_links = [
  { path: "", name: "Home", icon: renderIcon(Home) },
  { path: "", name: "Profile", icon: renderIcon(User) },
  { path: "", name: "Message", icon: renderIcon(Send) },
  { path: "", name: "Explore", icon: renderIcon(Compass) },
  { path: "", name: "Settings", icon: renderIcon(Settings) },
  { path: "", name: "Donation", icon: renderIcon(Footprints) },
];

const SideNav = () => {
  return (
    <div className="flex flex-col">
      {side_links.map((side_link, index) => (
        <Button
          key={index}
          className="mb-1 w-fit justify-start border-none bg-transparent shadow-none text-jet hover:text-yellow-orange hover:bg-transparent"
        >
          {side_link.icon}
          <span className="ml-2">{side_link.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default SideNav;
