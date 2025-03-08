import React from "react";
import CardPost from "./CardPost";

const arr = [1, 2, 3, 4];

const ListPost = () => {
  return (
    <>
      {arr.map((item) => {
        return <CardPost key={item} />;
      })}
    </>
  );
};

export default ListPost;
