"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  searchUsers,
  clearSearchResults,
  selectSearchResults,
  selectSearchStatus,
} from "@/redux/features/userSlice";
import { debounce } from "lodash";

// Inline useClickOutside hook
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);
  const dispatch = useDispatch();

  // Get search results from Redux
  const searchResults = useSelector(selectSearchResults);
  const searchStatus = useSelector(selectSearchStatus);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        dispatch(searchUsers({ query, limit: 10 }));
      } else {
        dispatch(clearSearchResults());
      }
    }, 500),
    [dispatch]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      setShowResults(true);
      debouncedSearch(value);
    } else {
      setShowResults(false);
      dispatch(clearSearchResults());
    }
  };

  // Close search results when clicking outside
  useClickOutside(searchRef, () => {
    setShowResults(false);
  });

  // Clean up search results when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  const handleUserClick = (userId) => {
    router.push(`/profile/${userId}`);
    setShowResults(false);
    setSearchTerm("");
    dispatch(clearSearchResults());
  };

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-yellow-orange" />
      <Input
        type="text"
        placeholder="Search users..."
        className="pl-10"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => searchTerm && setShowResults(true)}
      />

      {showResults && searchStatus === "loading" && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white shadow-lg rounded-md z-50 p-4 text-center text-gray-500">
          Loading...
        </div>
      )}

      {showResults &&
        searchStatus === "succeeded" &&
        searchResults.users?.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white shadow-lg rounded-md z-50 max-h-64 overflow-y-auto">
            {searchResults.users.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleUserClick(user._id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.username?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.username}</span>
                  {user.fullName && (
                    <span className="text-xs text-gray-500">
                      {user.fullName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      {showResults &&
        searchStatus === "succeeded" &&
        searchTerm &&
        searchResults.users?.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white shadow-lg rounded-md z-50 p-4 text-center text-gray-500">
            No users found
          </div>
        )}
    </div>
  );
};

export default SearchBar;
