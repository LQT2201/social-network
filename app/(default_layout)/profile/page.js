import React from "react";
import SideNav from "../homepage/_components/SideNav";
import Image from "next/image";
import test1 from "@/public/images/test-1.jpg";
import { Settings, Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TabPost from "../homepage/_components/TabPost";
import ListPost from "../homepage/_components/ListPost";

const pets = [
  { name: "Jeff", image: test1 },
  { name: "Tail", image: test1 },
  { name: "Joy", image: test1 },
  { name: "Small Bob", image: test1 },
  { name: "Mily", image: test1 },
  { name: "Chubby", image: test1 },
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
        <div className="bg-white rounded-xl pb-4">
          <div className="rounded-t-md relative bg-white">
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
          <div className="mt-10 flex justify-between items-center px-4">
            <div className="flex-4/5">
              <p className="text-gray-500 text-sm">@alicemitchell</p>

              <h2 className="text-xl font-bold">Alice friends</h2>
              <h2 className="text-gray-600 text-sm mt-1">
                Do it now. Sometimes “Later” Becomes Never. Do it now.
              </h2>
            </div>

            {/* Followers / Following */}
            <div className="flex flex-col gap-2">
              {/* Edit Profile Button */}
              <button className="flex gap-2 items-center border px-4 py-2 rounded-4xl text-sm font-semibold hover:bg-gray-100 transition">
                <Settings size={15} /> Edit profile
              </button>
              <div className="flex flex-row gap-3">
                <div>
                  <p className="text-lg font-bold">2567</p>
                  <p className="text-gray-500 text-sm">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-bold">345</p>
                  <p className="text-gray-500 text-sm">Following</p>
                </div>
              </div>
            </div>
          </div>
          {/* Pet List */}
          <div className="m-0 px-4">
            <h3 className="text-md font-semibold">
              My Pets <span className="text-d-gray">({pets.length})</span>
            </h3>
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
              <div className="text-center text-d-gray">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-gray-300 cursor-pointer hover:bg-gray-100 transition">
                  <Plus size={20} />
                </div>
                <p className="text-xs mt-1">Add pet</p>
              </div>
            </div>
          </div>
        </div>
        <TabPost />
        <ListPost />
      </div>
    </div>
  );
};

export default ProfilePage;
