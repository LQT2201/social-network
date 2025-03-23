import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, ChartBar, NotebookText, Video } from "lucide-react";

const CreatePostSection = () => {
  return (
    <div className="flex justify-between items-center">
      <Avatar className="size-20">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>QT</AvatarFallback>
      </Avatar>

      <PostOption icon={<Camera size={35} />} label="Photo" />
      <PostOption icon={<NotebookText size={35} />} label="Text" />
      <PostOption icon={<Video size={35} />} label="Video" />
      <PostOption icon={<ChartBar size={35} />} label="Poll" />
    </div>
  );
};

const PostOption = ({ icon, label }) => {
  return (
    <div className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center">
      <div className="mb-1 text-yellow-orange">{icon}</div>
      <h3 className="font-bold">{label}</h3>
    </div>
  );
};

export default CreatePostSection;
