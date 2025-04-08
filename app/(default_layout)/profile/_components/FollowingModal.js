"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingUsers } from "@/redux/features/profileSlice";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const FollowingModal = ({
  profileUser,
  showFollowing,
  onClose,
  currentUserFollowing = [],
  onToggleFollow, // function(userId) => void
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const following = useSelector((state) => state.profile.following);

  const filteredFollowing = following.filter((follow) => {
    if (typeof follow === "object") {
      return follow.username.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return String(follow).toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    if (showFollowing) {
      dispatch(getFollowingUsers({ userId: profileUser._id }));
    }
  }, [showFollowing]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-80">
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search following..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <h3 className="text-lg font-bold mb-4">Following</h3>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px] pr-4">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          }
        >
          <ScrollArea className="h-[300px] pr-4">
            {filteredFollowing && filteredFollowing.length > 0 ? (
              <div className="space-y-4">
                {filteredFollowing.map((follow) => (
                  <div
                    key={follow._id || follow}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    {typeof follow === "object" && follow.avatar ? (
                      <Avatar>
                        <AvatarImage
                          src={follow.avatar}
                          alt={follow.username}
                        />
                        <AvatarFallback>
                          {follow.username
                            ? follow.username[0].toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarFallback>
                          {typeof follow === "object" && follow.username
                            ? follow.username[0].toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      {typeof follow === "object" ? (
                        <>
                          <Link href={`/profile/${follow._id}`}>
                            <p className="font-medium hover:underline">
                              {follow.username}
                            </p>
                          </Link>
                          <p className="text-sm text-gray-500">
                            {follow.email || ""}
                          </p>
                        </>
                      ) : (
                        <p className="font-medium">{follow}</p>
                      )}
                    </div>
                    {typeof follow === "object" && (
                      <Button
                        size="sm"
                        variant={
                          currentUserFollowing.includes(follow._id)
                            ? "outline"
                            : "default"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleFollow) {
                            onToggleFollow(follow._id);
                          }
                        }}
                      >
                        {currentUserFollowing.includes(follow._id)
                          ? "Unfollow"
                          : "Follow"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No following found</p>
              </div>
            )}
          </ScrollArea>
        </Suspense>
        <Button onClick={onClose} className="mt-4 w-full">
          Close
        </Button>
      </div>
    </div>
  );
};

export default FollowingModal;
