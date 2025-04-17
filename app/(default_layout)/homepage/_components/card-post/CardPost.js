"use client";
import PostHeader from "./PostHeader";
import MediaGallery from "./MediaGallery";
import PostActions from "./PostActions";

const CardPost = ({ post, onLike, onCommentClick }) => {
  const {
    username,
    postedAt,
    caption,
    likes,
    liked,
    comments,
    shares,
    like,
    userId,
    avatar,
    media,
  } = post;

  return (
    <div className="bg-white rounded-xl shadow mb-4 overflow-hidden">
      <PostHeader
        username={username}
        postedAt={postedAt}
        userId={userId}
        avatar={avatar}
      />

      <div className="px-4 mb-4 text-gray-800">{caption}</div>

      {media && <MediaGallery media={media} />}

      <PostActions
        liked={liked}
        likes={likes}
        comments={comments}
        shares={shares}
        onLike={onLike}
        onCommentClick={onCommentClick}
        postId={post.id}
      />
    </div>
  );
};

export default CardPost;
