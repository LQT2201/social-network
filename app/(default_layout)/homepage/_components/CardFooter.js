"use client";
import { Heart, Mails, Share2 } from "lucide-react";

const CardFooter = () => (
  <div className="rounded-b-lg bg-white py-3 px-5 text-d-gray">
    <p className="text-jet line-clamp-2">Canon, CON CAC 204 MARK IV</p>
    <div className="flex flex-row justify-between mt-5">
      <div className="flex gap-2">
        <Heart className="fill-d-gray" />
        <p>166</p>
      </div>
      <div className="flex gap-3">
        <Share2 className="fill-d-gray" />
        <Mails
          onClick={() => {
            alert("concac");
          }}
        />
      </div>
    </div>
  </div>
);

export default CardFooter;
