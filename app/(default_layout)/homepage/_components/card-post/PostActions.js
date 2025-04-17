import { MessageCircle, Share2, Copy, Facebook, Twitter } from "lucide-react";
import LikeButton from "./LikeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";

const PostActions = ({
  liked,
  likes,
  comments,
  shares,
  onLike,
  onCommentClick,
  postId,
}) => {
  const handleShare = async (type) => {
    const url = `${window.location.origin}/post/${postId}`;

    switch (type) {
      case "copy":
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
        break;
      default:
        break;
    }
  };

  return (
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-gray-600 hover:opacity-75 transition-all duration-200">
                <Share2 className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuItem
                onClick={() => handleShare("copy")}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-md"
              >
                <Copy className="w-4 h-4 text-gray-600" />
                <span>Copy link</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-md"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Share to Facebook</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-md"
              >
                <Twitter className="w-4 h-4 text-sky-500" />
                <span>Share to Twitter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default PostActions;
