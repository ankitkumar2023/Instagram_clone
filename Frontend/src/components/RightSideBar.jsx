import React from "react";
import Avatar from "./ui/Avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-[400px] h-screen px-5 py-6 fixed right-0 top-8 hidden lg:flex flex-col z-20">
      {/* User Profile Section */}
      <div className="flex items-center justify-between">
        <Link to={`/profile/${user?._id}`} className="flex items-center gap-3">
          <Avatar src={`${user?.profilePicture}`} name={`${user?.username}`} />
          <div>
            <p className="font-semibold text-gray-800">{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.bio}</p>
          </div>
        </Link>
        <button className="text-sm font-semibold text-blue-500 hover:text-blue-700">Switch</button>
      </div>

      {/* Suggested Users */}
      <SuggestedUser />
    </div>
  );
};

export default RightSideBar;
