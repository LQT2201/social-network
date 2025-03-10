import { Heart } from "lucide-react";
import React from "react";

const LikeButton = ({ liked, onClick }) => {
  return (
    <button onClick={onClick} aria-label="Like">
      <Heart
        size={15}
        className={`transition-colors ${
          liked
            ? "fill-red-500 text-red-500 hover:text-red-300"
            : "fill-transparent text-gray-500 hover:text-red-300"
        }`}
      />
    </button>
  );
};

export default LikeButton;
