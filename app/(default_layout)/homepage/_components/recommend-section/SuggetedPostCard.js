import React from "react";
import Image from "next/image";
import test1 from "@/public/images/test-1.jpg";
import { Ellipsis, FlagOff, Heart, Mails, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CardHeader = () => (
  <div className="flex flex-row justify-between items-center py-3 px-5">
    <p className="text-jet">michilin.boy</p>
    <div className="flex text-d-gray gap-2 items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <FlagOff className="cursor-pointer hover:text-jet" size={20} />
          </TooltipTrigger>
          <TooltipContent className="bg-jet">
            <p>Report</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
);

const CardContent = () => (
  <div className=" overflow-hidden flex items-center justify-center  relative aspect-square">
    <Image
      src={test1}
      alt="card-name"
      className="w-full h-full  object-cover fill"
      loading="eager"
    />
  </div>
);

const CardFooter = () => (
  <div className="rounded-b-lg bg-white py-3 px-5 text-d-gray">
    <p className="text-jet line-clamp-1">Canon, CON CAC 204 MARK IV</p>
  </div>
);

const SuggestedPostCard = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg mt-3 text-sm">
      <CardHeader />
      <CardContent />
      <CardFooter />
    </div>
  );
};

export default SuggestedPostCard;
