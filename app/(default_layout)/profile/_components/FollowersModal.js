"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { getFollowersUsers } from "@/redux/features/profileSlice";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const FollowersModal = ({
  showFollowers,
  profileUser,
  onClose,
  currentUserFollowing = [],
  onToggleFollow, // function(userId) => void
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const followers = useSelector((state) => state.profile.followers);

  const filteredFollowers = followers.filter((follower) => {
    if (typeof follower === "object") {
      return follower.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
    return String(follower).toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    if (showFollowers) {
      dispatch(getFollowersUsers({ userId: profileUser._id }));
    }
  }, [showFollowers]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-80">
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search followers..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <h3 className="text-lg font-bold mb-4">Followers</h3>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px] pr-4">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          }
        >
          <ScrollArea className="h-[300px] pr-4">
            {filteredFollowers && filteredFollowers.length > 0 ? (
              <div className="space-y-4">
                {filteredFollowers.map((follower) => (
                  <div
                    key={follower._id || follower}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    {typeof follower === "object" && follower.avatar ? (
                      <Avatar>
                        <AvatarImage
                          src={follower.avatar}
                          alt={follower.username}
                        />
                        <AvatarFallback>
                          {follower.username
                            ? follower.username[0].toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarFallback>
                          {typeof follower === "object" && follower.username
                            ? follower.username[0].toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      {typeof follower === "object" ? (
                        <>
                          <Link href={`/profile/${follower._id}`}>
                            <p className="font-medium hover:underline">
                              {follower.username}
                            </p>
                          </Link>
                          <p className="text-sm text-gray-500">
                            {follower.email || ""}
                          </p>
                        </>
                      ) : (
                        <p className="font-medium">{follower}</p>
                      )}
                    </div>
                    {typeof follower === "object" && (
                      <Button
                        size="sm"
                        variant={
                          currentUserFollowing.includes(follower._id)
                            ? "outline"
                            : "default"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleFollow) {
                            onToggleFollow(follower._id);
                          }
                        }}
                      >
                        {currentUserFollowing.includes(follower._id)
                          ? "Unfollow"
                          : "Follow"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No followers found</p>
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

export default FollowersModal;
