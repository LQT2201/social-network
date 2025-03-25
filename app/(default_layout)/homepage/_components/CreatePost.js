"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "@/redux/features/postSlice";
import { Camera, ChartBar, NotebookText, Video } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const CreatePost = ({ user }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState(null);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", content);
      formData.append("author", "67dcdf1681fb3fb45d58a177");
      files.forEach((file) => {
        formData.append("media", file);
      });

      await dispatch(createPost(formData)).unwrap();
      toast.success("Đăng bài thành công");
      setOpen(false);
      setContent("");
      setFiles([]);
    } catch (error) {
      toast.error(error.message || "Không thể đăng bài");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Avatar className="size-20">
          <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
          <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
        </Avatar>

        <div
          onClick={() => {
            setPostType("photo");
            setOpen(true);
          }}
          className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50"
        >
          <Camera size={35} className="mb-1 text-yellow-orange" />
          <h3 className="font-bold">Photo</h3>
        </div>

        <div
          onClick={() => {
            setPostType("text");
            setOpen(true);
          }}
          className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50"
        >
          <NotebookText size={35} className="mb-1 text-yellow-orange" />
          <h3 className="font-bold">Text</h3>
        </div>

        <div
          onClick={() => {
            setPostType("video");
            setOpen(true);
          }}
          className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50"
        >
          <Video size={35} className="mb-1 text-yellow-orange" />
          <h3 className="font-bold">Video</h3>
        </div>

        <div
          onClick={() => {
            setPostType("poll");
            setOpen(true);
          }}
          className="bg-white rounded-lg w-1/5 h-20 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50"
        >
          <ChartBar size={35} className="mb-1 text-yellow-orange" />
          <h3 className="font-bold">Poll</h3>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tạo bài viết mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Bạn đang nghĩ gì?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {(postType === "photo" || postType === "video") && (
              <Input
                type="file"
                accept={postType === "photo" ? "image/*" : "video/*"}
                multiple={postType === "photo"}
                onChange={(e) => setFiles(Array.from(e.target.files))}
              />
            )}

            <Button
              onClick={handleCreatePost}
              disabled={loading || !content}
              className="w-full"
            >
              {loading ? "Đang đăng..." : "Đăng bài"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePost;
