import React from "react";
import Posts from "./Posts";

const Feed = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <h1 className="font-semibold text-center text-2xl py-2  bg-gray-50 fixed top-0 w-full z-10">
        Instagram
      </h1>

      {/* Scrollable Feed Section */}
      <div className="flex-1 mt-[60px] overflow-y-auto pl-[20%] custom-scrollbar">
        <Posts />
      </div>
    </div>
  );
};

export default Feed;
