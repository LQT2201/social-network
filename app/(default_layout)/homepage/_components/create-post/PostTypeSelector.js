import { Camera, ChartBar, NotebookText, Video } from "lucide-react";

const PostType = ({ icon: Icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50"
  >
    <Icon size={35} className="mb-1 text-yellow-orange" />
    <h3 className="font-bold">{label}</h3>
  </div>
);

export const PostTypeSelector = ({ onSelectType }) => {
  const types = [
    { icon: Camera, label: "Photo", type: "photo" },
    { icon: NotebookText, label: "Text", type: "text" },
    { icon: Video, label: "Video", type: "video" },
    { icon: ChartBar, label: "Poll", type: "poll" },
  ];

  return (
    <div className="flex justify-between items-center mb-4">
      {types.map(({ icon, label, type }) => (
        <PostType
          key={type}
          icon={icon}
          label={label}
          onClick={() => onSelectType(type)}
        />
      ))}
    </div>
  );
};
