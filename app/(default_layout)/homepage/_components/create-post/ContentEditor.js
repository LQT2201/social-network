import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";

export const ContentEditor = ({
  content,
  setContent,
  showEmojiPicker,
  setShowEmojiPicker,
}) => {
  const onEmojiClick = (emojiObject) => {
    const cursor = document.getElementById("postContent").selectionStart;
    setContent(
      (prev) => prev.slice(0, cursor) + emojiObject.emoji + prev.slice(cursor)
    );
  };

  return (
    <div className="relative">
      <textarea
        id="postContent"
        placeholder="Bạn đang nghĩ gì?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[100px] resize-none rounded-lg border border-input 
                 bg-background px-3 py-2 text-sm ring-offset-background 
                 placeholder:text-muted-foreground focus-visible:outline-none 
                 focus-visible:ring-2 focus-visible:ring-ring"
      />

      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 hover:bg-accent"
          >
            <Smile className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="end">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            lazyLoadEmojis={true}
            searchPlaceholder="Search emoji..."
            width="100%"
            height={350}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
