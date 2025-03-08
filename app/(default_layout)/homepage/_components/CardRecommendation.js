import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";
import Link from "next/link";

const test = [1, 2, 3];

const CardRecommendation = () => {
  return (
    <>
      {test.map((item) => {
        return (
          <div
            key={item}
            className="p-3 my-2 bg-white rounded-md flex text-xs justify-center items-center"
          >
            <Link href="/">
              <Avatar className="size-11 ">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>QT</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-3/5 mx-3">
              <p className="text-jet hover:text-d-gray">
                <b>sempupy23</b>
              </p>
              <p className="line-clamp-1">
                Have a nice days sdf asdf asf asdfas sdf
              </p>
            </div>
            <div className="justify-center items-end flex flex-col ">
              <X
                size={15}
                className="cursor-pointer text-d-gray hover:text-jet"
              />
              <p className="text-l-yellow hover:text-yellow-orange cursor-pointer">
                Follow
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CardRecommendation;
