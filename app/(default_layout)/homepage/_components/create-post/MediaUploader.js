import { Camera, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const MediaUploader = ({
  postType,
  previews,
  onFileChange,
  onRemoveFile,
}) => {
  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => document.getElementById("fileInput").click()}
      >
        <Camera className="mr-2" /> Thêm ảnh/Video
      </Button>

      <Input
        id="fileInput"
        type="file"
        accept={postType === "photo" ? "image/*" : "video/*"}
        multiple={postType === "photo"}
        className="hidden"
        onChange={onFileChange}
      />

      <div className="grid grid-cols-2 gap-2 min-h-[200px] bg-gray-50 rounded-lg p-2">
        {previews.length > 0 ? (
          previews.map((preview, index) => (
            <div key={preview} className="relative aspect-square">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => onRemoveFile(index)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/75 transition-colors z-10"
              >
                <X size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center text-gray-400 h-[200px]">
            <Camera size={40} />
            <p className="mt-2">Upload photos or videos</p>
          </div>
        )}
      </div>
    </div>
  );
};
