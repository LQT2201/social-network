"use client";
import PostHeader from "./PostHeader";
import MediaGallery from "./MediaGallery";
import PostActions from "./PostActions";

const CardPost = ({ post, onLike, onCommentClick }) => {
  const { username, postedAt, caption, likes, liked, comments, shares, like } =
    post;

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      <PostHeader
        username={username}
        postedAt={postedAt}
        avatar={post.author?.avatar}
      />

      <p className="px-4 mb-4 text-gray-800">{caption}</p>

      <MediaGallery media={post.media} />

      <PostActions
        liked={liked}
        likes={likes}
        comments={comments}
        shares={shares}
        onLike={onLike}
        onCommentClick={onCommentClick}
      />
    </div>
  );
};

export default CardPost;
