import { Heart, MessageCircle, Share2 } from "lucide-react";
import LikeButton from "./LikeButton";

const PostActions = ({
  liked,
  likes,
  comments,
  shares,
  onLike,
  onCommentClick,
}) => (
  <div className="px-4 py-2">
    <div className="flex items-center gap-4 justify-between">
      <LikeButton likes={likes} liked={liked} onLike={onLike} />
      <div className="flex items-center gap-4">
        <button
          onClick={onCommentClick}
          className="flex items-center mr-6 text-gray-600 hover:opacity-75 transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="ml-2 font-medium">{comments.length}</span>
        </button>

        <button className="flex items-center text-gray-600 hover:opacity-75 transition-all duration-200">
          <Share2 className="w-6 h-6" />
          <span className="ml-2 font-medium">{shares}</span>
        </button>
      </div>
    </div>
  </div>
);

export default PostActions;
