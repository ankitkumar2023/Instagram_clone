import React, { useState } from "react";
import Avatar from "./ui/Avatar";
import { CiSettings } from "react-icons/ci";
import { useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  console.log("user id inside profile component", userId);
  useGetUserProfile(userId);


  const { userProfile } = useSelector((store) => store.auth);
  console.log("user data inside profile page", userProfile);
  const { user } = useSelector((store) => store.auth);
  const [isactiveTab, setActiveTab] = useState("");

  const handleActiveTab = (tab) => {
    setActiveTab(tab)
  }
  return (
    <div className="w-full min-h-screen flex justify-center py-10 bg-gray-50">
      <div className="w-[900px] ">
        {/* Profile Header */}
        <div className="flex items-center justify-between pb-8 border-b">
          {/* Avatar Section */}
          <div className="w-36 h-36 ml-36">
            <Avatar src={`${userProfile?.profilePicture}`} name={`${userProfile?.username}`} alt="user_profile_pic" size="150px" />
          </div>

          {/* User Info Section */}
          <div className="flex-1 ml-10">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold">
                {userProfile?.username}
              </h2>
              {user?._id == userId ? (
                <div className="flex gap-2 justify-between">
                  <button className="text-sm bg-gray-200 px-4 py-1 rounded-md hover:bg-gray-300">
                    Edit Profile
                  </button>
                  <button className="text-sm bg-gray-200 px-4 py-1 rounded-md hover:bg-gray-300">
                    View archive
                  </button>
                  <CiSettings className="text-2xl cursor-pointer" />
                </div>
              ) : (
                <button className="text-sm bg-blue-300 px-4 py-1 rounded-md hover:bg-blue-400 text-white">
                  Follow
                </button>
              )}
            </div>

            <div className="flex space-x-6 mt-4">
              <span>
                <strong>{ userProfile?.posts.length}</strong> posts
              </span>
              <span>
                <strong>{userProfile?.followers.length }</strong> followers
              </span>
              <span>
                <strong>{userProfile?.following.length }</strong> following
              </span>
            </div>

            <div className="mt-3">
              <p className="font-semibold">{ userProfile?.username}</p>
              <p className="text-sm text-gray-600">{userProfile?.bio }</p>
            </div>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="flex justify-center space-x-10 text-gray-600 mt-6 border-t pt-3 uppercase text-sm tracking-widest">
          <span
            onClick={() =>handleActiveTab("Posts")}
            className={`font-semibold text-black border-t-2 border-black py-2 ${isactiveTab=="Posts" ? "font-bold":""}`}>
            Posts
          </span>
          <span
            onClick={() =>handleActiveTab("Reels")}
            className={`font-light text-black border-t-2   cursor-pointer border-black py-2 ${isactiveTab == "Reels" ? "font-bold" : ""}`}>Reels</span>
          <span
            onClick={() =>handleActiveTab("Saved")}
            className={`font-light text-black border-t-2  cursor-pointer border-black py-2 ${isactiveTab == "Saved" ? "font-bold" : ""}`}>Saved</span>
          <span
            onClick={() =>handleActiveTab("Tagged")}
            className={`font-light text-black border-t-2 cursor-pointer border-black py-2 ${isactiveTab == "Tagged" ? "font-bold" : ""}`}>Tagged</span>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 mt-6">
          {userProfile.posts.map((item, index) => (
            <div
              key={index}
              className="w-full h-60 bg-gray-300 hover:opacity-80 cursor-pointer"
            >
             
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
