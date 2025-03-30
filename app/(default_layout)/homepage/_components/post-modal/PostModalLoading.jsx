import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PostModalLoading = () => {
  return (
    <DialogContent className="sm:max-w-[80vh] max-h-[80vh] overflow-y-auto p-0">
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </DialogContent>
  );
};

export default PostModalLoading;
