"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRecommendUsers,
  selectRecommendUsers,
  selectRecommendUsersStatus,
} from "@/redux/features/userSlice";
import RecommendationCardItem from "./RecommendationCardItem";
import NoMoreRecommendations from "./NoMoreRecommendations";

const RecommendationList = () => {
  const dispatch = useDispatch();
  const recommendUsers = useSelector(selectRecommendUsers);
  const status = useSelector(selectRecommendUsersStatus);
  const [displayedUsers, setDisplayedUsers] = useState([]);

  useEffect(() => {
    dispatch(getRecommendUsers({ limit: 5 }));
  }, [dispatch]);

  useEffect(() => {
    if (recommendUsers?.length > 0) {
      setDisplayedUsers(recommendUsers);
    }
  }, [recommendUsers]);

  const handleRemoveRecommendation = (userId) => {
    setDisplayedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  if (status === "loading") {
    return (
      <div className="p-4 bg-white rounded-md shadow-sm">
        <h2 className="text-lg font-bold mb-4">People You Might Know</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-3 bg-gray-100 animate-pulse rounded-md h-16"
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed" || displayedUsers.length === 0) {
    return (
      <div className="p-4 bg-white rounded-md shadow-sm">
        <h2 className="text-lg font-bold mb-4">People You Might Know</h2>
        <NoMoreRecommendations title="No recommendations available" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <h2 className="text-lg font-bold mb-4">People You Might Know</h2>
      <div className="space-y-3">
        {displayedUsers.map((user) => (
          <RecommendationCardItem
            key={user._id}
            recommendation={user}
            onRemove={handleRemoveRecommendation}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
