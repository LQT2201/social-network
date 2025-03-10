"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import CardPost from "./CardPost";
import { Separator } from "@/components/ui/separator";
import CommentList from "./CommentList";

// Sample nested comments data
const commentsData = [
  {
    id: 1,
    author: "User1",
    content:
      "Đây là comment đầu tiên. Đây là comment đầu tiên. Đây là comment đầu tiên. Đây là comment đầu tiên. Đây là comment đầu tiên",
    liked: true,
    replies: [
      {
        id: 2,
        author: "User2",
        content: "Trả lời comment đầu tiên.",
        liked: false,
        replies: [
          {
            id: 3,
            author: "User3",
            content: "Phản hồi của User3.",
            liked: false,
            replies: [],
          },
          {
            id: 4,
            author: "User4",
            content: "Một phản hồi khác của User4.",
            liked: false,
            replies: [],
          },
        ],
      },
      {
        id: 5,
        author: "User5",
        content: "Một phản hồi khác cho comment đầu tiên.",
        liked: true,
        replies: [],
      },
    ],
  },
  {
    id: 6,
    author: "User6",
    content: "Đây là comment thứ hai.",
    liked: false,
    replies: [],
  },
];

const PostModal = ({ open, setOpen }) => {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vh] max-h-[80vh] overflow-y-auto p-0">
          <DialogTitle></DialogTitle>
          <CardPost />
          <div className="grid gap-4">
            <Separator />
            <div className="px-5 py-3">
              <h3>
                Comments{" "}
                <span className="text-gray-500 inline">
                  ( {commentsData.length} )
                </span>
              </h3>
              <div className="mt-3">
                <CommentList
                  comments={commentsData}
                  handleLikeComment={(pre) => !pre}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostModal;
