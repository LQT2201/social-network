import React from "react";
import SideNav from "../homepage/_components/SideNav";

const page = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-2 lg:flex md:hidden sm:hidden">
        <div className="sticky top-5">
          <SideNav />
        </div>
      </div>

      <div className="col-span-10 bg-red-300"></div>
    </div>
  );
};

export default page;
