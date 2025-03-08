import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";

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
            <Avatar className="size-11 ">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>QT</AvatarFallback>
            </Avatar>
            <div className="flex-3/5 mx-3">
              <p>
                <b>sempupy23</b>
              </p>
              <p className="line-clamp-1">
                Have a nice days sdf asdf asf asdfas sdf
              </p>
            </div>
            <div className="justify-center items-end flex flex-col">
              <X size={15} />
              <p className="text-yellow-orange">Follow</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CardRecommendation;
