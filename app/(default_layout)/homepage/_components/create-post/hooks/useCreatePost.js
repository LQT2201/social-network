import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "@/redux/features/postSlice";
import { toast } from "react-hot-toast";

export const useCreatePost = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const handleNewFiles = (newFiles) => {
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
      return () =>
        newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };

    if (files.length > 0) {
      handleNewFiles(files);
    }
  }, [files]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", content);
      formData.append("visibility", visibility);
      files.forEach((file) => formData.append("media", file));

      await dispatch(createPost(formData)).unwrap();
      toast.success("Đăng bài thành công");
      return true;
    } catch (error) {
      toast.error(error.message || "Không thể đăng bài");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setContent("");
    setFiles([]);
    setPreviews([]);
    setVisibility("public");
  };

  return {
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
  };
};
