import React from "react";

const TabPost = () => {
  return (
    <div className="flex flex-row cursor-pointer gap-3 mt-7 border-b-l-gray border-b-1">
      <p className="text-yellow-orange border-b-3 pb-1.5 border-b-yellow-orange">
        Following
      </p>
      <p className="text-d-gray hover:text-l-yellow">For you</p>
      <p className="text-d-gray hover:text-l-yellow">Your tags</p>
    </div>
  );
};

export default TabPost;
