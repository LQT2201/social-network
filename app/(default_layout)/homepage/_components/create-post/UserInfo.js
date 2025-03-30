import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Users, Lock } from "lucide-react";

const VisibilityOption = ({ value, icon: Icon, label }) => (
  <SelectItem value={value}>
    <div className="flex items-center gap-2">
      <Icon size={14} />
      <span>{label}</span>
    </div>
  </SelectItem>
);

export const UserInfo = ({ user, visibility, onVisibilityChange }) => {
  const visibilityOptions = [
    { value: "public", icon: Globe, label: "Public" },
    { value: "friends", icon: Users, label: "Friends" },
    { value: "private", icon: Lock, label: "Only me" },
  ];

  const selectedOption = visibilityOptions.find(
    (opt) => opt.value === visibility
  );
  const Icon = selectedOption?.icon;

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
          <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{user?.username || "User"}</span>
          <Select value={visibility} onValueChange={onVisibilityChange}>
            <SelectTrigger className="w-[130px] h-7 text-xs p-0 m-0 border-none shadow-none hover:shadow-yellow-orange focus:ring-0 focus:outline-none">
              <SelectValue>
                {Icon && (
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <span>{selectedOption.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {visibilityOptions.map(({ value, icon: Icon, label }) => (
                <VisibilityOption
                  key={value}
                  value={value}
                  icon={Icon}
                  label={label}
                />
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
