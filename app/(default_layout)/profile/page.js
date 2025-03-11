import React from "react";
import SideNav from "../homepage/_components/SideNav";
import Image from "next/image";
import test1 from "@/public/images/test-1.jpg";
import { Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfilePage = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* SideNav chỉ hiển thị trên màn hình lớn */}
      <div className="col-span-2 lg:block hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="col-span-12 lg:col-span-10">
        <div className="rounded-t-md relative">
          {/* Cài đặt */}
          <div className="absolute top-5 right-5 bg-a-ray rounded-full text-white p-2 cursor-pointer hover:bg-opacity-80 transition">
            <Settings size={20} />
          </div>

          {/* Ảnh cover */}
          <div>
            <Image
              src={test1}
              alt="Cover Image"
              className="w-full h-60 object-cover rounded-t-2xl"
            />
          </div>

          {/* Avatar */}
          <div className="absolute left-10 -bottom-10">
            <Avatar className="size-28 border-4 border-white shadow-lg">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>QT</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Nội dung profile bên dưới */}
        <div className=" p-6">
          <h1 className="text-2xl font-bold">Tên người dùng</h1>
          <p className="text-gray-500">Mô tả ngắn gọn về bản thân...</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
