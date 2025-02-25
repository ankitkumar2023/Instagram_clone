import React from "react";
import Avatar from "./ui/Avatar";
import useGetSuggestedUser from "../hooks/useGetSuggestedUser";
import { useSelector } from "react-redux";

const SuggestedUser = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between text-sm mb-3">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium text-blue-500 cursor-pointer hover:text-blue-700">
          See All
        </span>
      </div>

      {/* Suggested User List */}
      <div className="space-y-3">
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={`${user?.profilePicture}`}
                name={`${user?.username}`}
              />
              <div>
                <p className="text-sm font-semibold">{user?.username}</p>
                <p className="text-xs text-gray-500">Suggested for you</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-blue-500 hover:text-blue-700 hover:cursor-pointer">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUser;
