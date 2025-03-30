"use client";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PostTypeSelector } from "./PostTypeSelector";
import { MediaUploader } from "./MediaUploader";
import { useCreatePost } from "./hooks/useCreatePost";
import { UserInfo } from "./UserInfo";
import { ContentEditor } from "./ContentEditor";

const CreatePost = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState(null);
  const {
    content,
    setContent,
    files,
    previews,
    loading,
    visibility,
    setVisibility,
    showEmojiPicker,
    setShowEmojiPicker,
    handleFileChange,
    removeFile,
    handleCreatePost,
    resetForm,
  } = useCreatePost();

  const handleSubmit = async () => {
    const success = await handleCreatePost();
    if (success) {
      setOpen(false);
      resetForm();
    }
  };

  return (
    <>
      <PostTypeSelector
        onSelectType={(type) => {
          setPostType(type);
          setOpen(true);
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">Tạo bài viết</DialogTitle>
          </DialogHeader>

          <UserInfo
            user={user}
            visibility={visibility}
            onVisibilityChange={setVisibility}
          />

          <div className="space-y-4">
            <ContentEditor
              content={content}
              setContent={setContent}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
            />

            {(postType === "photo" || postType === "video") && (
              <MediaUploader
                postType={postType}
                previews={previews}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
              />
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading || (!content && files.length === 0)}
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
