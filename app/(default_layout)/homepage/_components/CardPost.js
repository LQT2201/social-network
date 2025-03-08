import React from "react";
import Image from "next/image";
import test1 from "@/public/images/test-1.jpg";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";

const CardContent = () => (
  <div className="h-90 overflow-hidden flex items-center justify-center">
    <Image src={test1} alt="card-name" className="w-full" loading="eager" />
  </div>
);

const CardPost = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg mt-3">
      <CardHeader />
      <CardContent />
      <CardFooter />
    </div>
  );
};

export default CardPost;
