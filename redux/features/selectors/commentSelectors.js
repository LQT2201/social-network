import { createSelector } from "@reduxjs/toolkit";

// Base selector
const selectCommentsState = (state) => state.comments;

// Memoized selector for comments by post ID
export const selectCommentsByPostId = createSelector(
  [
    (state, postId) =>
      selectCommentsState(state).commentsByPostId[postId] || [],
  ],
  (comments) => comments
);

// Memoized selector for organized comments
export const selectOrganizedComments = createSelector(
  [selectCommentsByPostId],
  (comments) => {
    const commentMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      commentMap[comment._id] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) parent.replies.push(commentMap[comment._id]);
      } else {
        rootComments.push(commentMap[comment._id]);
      }
    });

    return rootComments;
  }
);
