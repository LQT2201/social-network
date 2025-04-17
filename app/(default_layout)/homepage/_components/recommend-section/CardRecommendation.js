"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import {
  selectRecommendUsers,
  getRecommendUsers,
  selectRecommendUsersPagination,
} from "@/redux/features/userSlice";
import { Button } from "@/components/ui/button";
import NoMoreRecommendations from "./NoMoreRecommendations";

const RecommendationCardItem = dynamic(
  () => import("./RecommendationCardItem"),
  { suspense: true }
);

const LoadingFallback = () => (
  <div className="flex flex-col gap-2 mt-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="p-3 my-2 bg-white rounded-md animate-pulse h-16"
      />
    ))}
  </div>
);

const LoadMoreButton = ({ handleLoadMore }) => (
  <Button
    variant="link"
    onClick={handleLoadMore}
    className=" text-l-yellow rounded text-center hover:text-yellow-orange"
  >
    Load More
  </Button>
);

const CardRecommendation = () => {
  const recommendUsers = useSelector(selectRecommendUsers);
  const pagination = useSelector(selectRecommendUsersPagination);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const handleLoadMore = () => {
    if (pagination?.totalPages && currentPage < pagination.totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(getRecommendUsers({ page: nextPage }));
    }
  };

  useEffect(() => {
    if (!recommendUsers.length) {
      dispatch(getRecommendUsers({ page: currentPage }));
    }
  }, [dispatch, currentPage, recommendUsers.length]);

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Suspense fallback={<LoadingFallback />}>
        {recommendUsers.length == 0 && (
          <NoMoreRecommendations title="No Recommendation For You" />
        )}
        {recommendUsers.map((rec) => (
          <RecommendationCardItem key={rec._id} recommendation={rec} />
        ))}
      </Suspense>

      {pagination?.totalPages > currentPage && (
        <LoadMoreButton handleLoadMore={handleLoadMore} />
      )}

      {pagination?.totalPages === currentPage && recommendUsers.length > 0 && (
        <NoMoreRecommendations title="No More Recommendation For You" />
      )}
    </div>
  );
};

export default CardRecommendation;
