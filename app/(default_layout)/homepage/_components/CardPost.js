"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, Mails, Share2, Ellipsis } from "lucide-react";

const CardHeader = ({ username, postedAt }) => (
  <div className="flex flex-row justify-between py-3 px-5">
    <p className="text-jet">{username}</p>
    <div className="flex text-d-gray gap-2 items-center">
      <p>{postedAt}</p>
      <Ellipsis className="cursor-pointer hover:text-l-yellow" />
    </div>
  </div>
);

const CardContent = ({ image }) => (
  <div className="h-90 overflow-hidden flex items-center justify-center">
    <Image
      src={image}
      alt="card-image"
      className="w-full h-full"
      loading="eager"
      width={500} // adjust as needed
      height={500} // adjust as needed
    />
  </div>
);

const CardFooter = ({
  onCommentClick,
  caption,
  likeCount: initialLikeCount,
  liked: initialLiked,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleToggleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="rounded-b-lg bg-white py-3 px-5 text-d-gray">
      <p className="text-jet line-clamp-2">{caption}</p>
      <div className="flex flex-row justify-between mt-5">
        <div className="flex gap-2">
          <Heart
            onClick={handleToggleLike}
            className={`cursor-pointer ${
              liked ? "fill-red-500 text-red-500" : "fill-d-gray"
            }`}
          />
          <p>{likeCount}</p>
        </div>
        <div className="flex gap-3">
          <Share2 className="fill-d-gray" />
          <Mails onClick={onCommentClick} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

// CardPost combines header, content, and footer.
const CardPost = ({ onCommentClick, post }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg mt-3">
      <CardHeader username={post.username} postedAt={post.postedAt} />
      <CardContent image={post.image} />
      <CardFooter
        onCommentClick={onCommentClick}
        caption={post.caption}
        likeCount={post.likes}
        liked={post.liked}
      />
    </div>
  );
};

export default CardPost;
