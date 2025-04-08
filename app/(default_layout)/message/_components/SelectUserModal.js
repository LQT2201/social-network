"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import {
  createConversation,
  selectActiveConversation,
} from "@/redux/features/message";
import {
  getAllUsers,
  searchUsers,
  selectAllUsers,
  selectSearchResults,
  selectSearchStatus,
} from "@/redux/features/userSlice";

const SelectUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const activeConversation = useSelector(selectActiveConversation);
  const allUsers = useSelector(selectAllUsers);
  const searchResults = useSelector(selectSearchResults);
  const searchStatus = useSelector(selectSearchStatus);

  // Fetch all users on initial load
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllUsers({ page, limit }));
    }
  }, [isOpen, page, dispatch]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        dispatch(searchUsers({ query: searchTerm, page: 1, limit }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  const handleUserSelect = async (userId) => {
    try {
      const conversation = await dispatch(
        createConversation({ participantId: userId })
      ).unwrap();
      onClose();
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const displayedUsers = searchTerm ? searchResults.users : allUsers.users;
  const loading = searchStatus === "loading";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a Conversation</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[300px] pr-4">
          {!loading && displayedUsers?.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>No users found</p>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {displayedUsers?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleUserSelect(user._id)}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  {user.isOnline && (
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && allUsers.pagination?.hasMore && !searchTerm && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
              >
                Load More
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SelectUserModal;
