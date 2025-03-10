"use client";
import React from "react";
import CardPost from "./CardPost";

const fakePosts = [
  {
    id: 1,
    username: "michilin.boy",
    postedAt: "6 days ago",
    caption: "Canon, CON CAC 204 MARK IV",
    likes: 166,
    liked: false,
    image: "/images/test-1.jpg", // relative to your public folder
  },
  {
    id: 2,
    username: "photo.lover",
    postedAt: "4 days ago",
    caption: "Sunset over the mountains",
    likes: 205,
    image: "/images/test-1.jpg",
    liked: true,
  },
  {
    id: 3,
    username: "urban.style",
    postedAt: "3 days ago",
    caption: "City life at its best",
    likes: 300,
    image: "/images/test-1.jpg",
    liked: false,
  },
  {
    id: 4,
    username: "nature.fan",
    postedAt: "2 days ago",
    caption: "Exploring the forest",
    likes: 150,
    image: "/images/test-1.jpg",
    liked: false,
  },
];

const ListPost = ({ onCommentClick }) => {
  return (
    <>
      {fakePosts.map((post) => (
        <CardPost key={post.id} post={post} onCommentClick={onCommentClick} />
      ))}
    </>
  );
};

export default ListPost;
