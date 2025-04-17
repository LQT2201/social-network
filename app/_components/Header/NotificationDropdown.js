"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      content: "John sent you a message",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      content: "New post from Mary",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      content: "Your post received 10 likes",
      time: "3 hours ago",
      read: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <Bell />
        {notifications.some((n) => !n.read) && (
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start py-2 ${
                !notification.read ? "bg-gray-50" : ""
              }`}
            >
              <div className="font-medium">{notification.content}</div>
              <div className="text-xs text-gray-500">{notification.time}</div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="text-center py-4">
            No notifications
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-center text-blue-500 cursor-pointer"
          onClick={markAllAsRead}
        >
          Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
