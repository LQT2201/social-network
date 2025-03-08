import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CardPost from "./CardPost";
const PostModal = () => {
  return (
    <Dialog open>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] sm:h-max-[400px] object-contain">
        <div className="grid gap-4">
          <CardPost></CardPost>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
          <p> asdfdsa</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
