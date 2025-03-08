import React from "react";
import Image from "next/image";
import test1 from "@/public/images/test-1.jpg";
import { Ellipsis, Heart, Mails, Share2 } from "lucide-react";

const CardHeader = () => (
  <div className="flex flex-row justify-between py-3 px-5">
    <p className="text-jet">michilin.boy</p>
    <div className="flex text-d-gray gap-2 items-center">
      <p>6 days ago</p>
      <Ellipsis className="cursor-pointer hover:text-l-yellow" />
    </div>
  </div>
);

const CardContent = ({ height = 90 }) => (
  <div
    className={`h-${height} overflow-hidden flex items-center justify-center`}
  >
    <Image src={test1} alt="card-name" className="w-full" loading="eager" />
  </div>
);

const CardFooter = () => (
  <div className="rounded-b-lg bg-white py-3 px-5 text-d-gray">
    <p className="text-jet">Canon, CON CAC 204 MARK IV</p>
    <div className="flex flex-row justify-between mt-5">
      <div className="flex gap-2">
        <Heart className="fill-d-gray" />
        <p>166</p>
      </div>
      <div className="flex gap-3">
        <Share2 className="fill-d-gray" />
        <Mails />
      </div>
    </div>
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
