import React from "react";
import SideNav from "./_components/SideNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, ChartBar, NotebookText, Video } from "lucide-react";
import CardPost from "./_components/CardPost";
import TabPost from "./_components/TabPost";
import CardRecommendation from "./_components/CardRecommendation";

const HomePage = () => {
  return (
    <div className="max-w-screen w-7xl mx-auto px-20 pt-7 bg-baby-powder">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2 lg:flex md:hidden sm:hidden">
          <div className="sticky top-5">
            <SideNav />
          </div>
        </div>

        <div className="col-span-7 p-1 text-sm">
          <div className="flex justify-between items-center">
            <Avatar className="size-20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>QT</AvatarFallback>
            </Avatar>
            <div className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center">
              <Camera size={35} className="mb-1 text-yellow-orange" />
              <h3 className="font-bold">Photo</h3>
            </div>

            <div className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center">
              <NotebookText size={35} className="mb-1 text-yellow-orange" />
              <h3 className="font-bold">Text</h3>
            </div>

            <div className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center">
              <Video size={35} className="mb-1 text-yellow-orange" />
              <h3 className="font-bold">Video</h3>
            </div>

            <div className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center">
              <ChartBar size={35} className="mb-1 text-yellow-orange" />
              <h3 className="font-bold">Poll</h3>
            </div>
          </div>

          <TabPost />

          <CardPost />
        </div>

        <div className="col-span-3">
          <h2 className="text-xl font-medium text-jet">
            Check out these blogs
          </h2>
          <CardRecommendation />
          <h2 className="text-xl font-medium text-jet mt-3">
            Recommend for you
          </h2>
          <CardPost />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
