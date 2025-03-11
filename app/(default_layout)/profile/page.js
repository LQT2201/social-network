import React from "react";
import SideNav from "../homepage/_components/SideNav";
import Image from "next/image";
import test1 from "@/public/images/test-1.jpg";
import { Settings, Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const pets = [
  { name: "Jeff", image: "/images/pet1.jpg" },
  { name: "Tail", image: "/images/pet2.jpg" },
  { name: "Joy", image: "/images/pet3.jpg" },
  { name: "Small Bob", image: "/images/pet4.jpg" },
  { name: "Mily", image: "/images/pet5.jpg" },
  { name: "Chubby", image: "/images/pet6.jpg" },
];

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

        {/* User Info */}
        <div className="mt-12 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Alice friends</h2>
            <p className="text-gray-500 text-sm">@alicemitchell</p>
            <p className="text-gray-600 text-sm mt-1">
              Do it now. Sometimes “Later” Becomes Never.
            </p>
          </div>

          {/* Edit Profile Button */}
          <button className="border px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
            ✏ Edit profile
          </button>
        </div>

        {/* Followers / Following */}
        <div className="flex space-x-8 mt-4">
          <div>
            <p className="text-lg font-bold">2567</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold">345</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
        </div>

        {/* Pet List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">My Pets ({pets.length})</h3>
          <div className="flex space-x-4 mt-3">
            {pets.map((pet, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm mt-1">{pet.name}</p>
              </div>
            ))}

            {/* Add Pet */}
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-gray-300 cursor-pointer hover:bg-gray-100 transition">
              <Plus size={20} className="text-gray-500" />
              <p className="text-xs mt-1">Add pet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
