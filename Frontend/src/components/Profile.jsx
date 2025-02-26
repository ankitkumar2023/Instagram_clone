import React, { useState } from "react";
import Avatar from "./ui/Avatar";
import { CiSettings } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import { Heart, MessageCircle } from "lucide-react";
import CommentDialog from "./CommentDialog";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  console.log("user id inside profile component", userId);
  useGetUserProfile(userId);

  const { userProfile } = useSelector((store) => store.auth);
  console.log("user data inside profile page", userProfile);
  const { user } = useSelector((store) => store.auth);
  const [isactiveTab, setActiveTab] = useState("Posts");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  

  const handleActiveTab = (tab) => {
    console.log("tab that is selected", tab);
    setActiveTab(tab);
  };

  const displayedPost =
    isactiveTab === "Posts" ? userProfile?.posts : userProfile?.bookmarks;
  console.log("displayedPost", displayedPost);

  const isAFollower = user?.followers.includes(userProfile?.id)
    ? "Follow Back"
    : "Follow";

  return (
    <div className="w-full min-h-screen flex justify-center py-10 bg-gray-50">
      <div className="w-[900px]">
        {/* Profile Header */}
        <div className="flex items-center justify-between pb-8 border-b">
          {/* Avatar Section */}
          <div className="w-36 h-36 ml-36">
            <Avatar
              src={`${userProfile?.profilePicture}`}
              name={`${userProfile?.username}`}
              alt="user_profile_pic"
              size="150px"
            />
          </div>

          {/* User Info Section */}
          <div className="flex-1 ml-10">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold">
                {userProfile?.username}
              </h2>
              {user?._id == userId ? (
                <div className="flex gap-2 justify-between">
                  <button
                    onClick={()=>navigate('/account/edit')}
                    className="text-sm bg-gray-200 px-4 py-1 rounded-md hover:bg-gray-300">
                    Edit Profile
                  </button>
                  <button className="text-sm bg-gray-200 px-4 py-1 rounded-md hover:bg-gray-300">
                    View archive
                  </button>
                  <CiSettings className="text-2xl cursor-pointer" />
                </div>
              ) : (
                <button className="text-sm bg-blue-300 px-4 py-1 rounded-md hover:bg-blue-400 text-white">
                  {isAFollower}
                </button>
              )}
            </div>

            <div className="flex space-x-6 mt-4">
              <span>
                <strong>{userProfile?.posts.length}</strong> posts
              </span>
              <span>
                <strong>{userProfile?.followers.length}</strong> followers
              </span>
              <span>
                <strong>{userProfile?.following.length}</strong> following
              </span>
            </div>

            <div className="mt-3">
              <p className="font-semibold">{userProfile?.username}</p>
              <p className="text-sm text-gray-600">{userProfile?.bio}</p>
            </div>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="flex justify-center space-x-10 text-gray-600 mt-6 border-t pt-3 uppercase text-sm tracking-widest">
          {["Posts", "Reels", "Saved", "Tagged"].map((tab) => (
            <span
              key={tab}
              onClick={() => handleActiveTab(tab)}
              className={`font-light text-black cursor-pointer py-2 ${
                isactiveTab === tab
                  ? "font-bold border-black border-t-2"
                  : "border-transparent border-t-2"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 mt-6">
          {displayedPost?.map((post, index) => (
            
            <div
              onClick={() => setIsOpen(true)}
              key={post?._id}
              className="relative w-full h-130 bg-gray-300 group"
            >
              
              <img src={post.image} className="w-full h-full object-cover" />
              {/* {isOpen && (
                <CommentDialog
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  post={post}
                  user={user}
                />
              )} */}
              {
                console.log("post inside profile ",post)
              }
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity">
                <div className="flex items-center text-white space-x-6">
                  <button className="flex items-center gap-2 hover:text-gray-300">
                    <Heart />
                    <span>{post?.likes.length}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-gray-300">
                    <MessageCircle />
                    <span>{post?.comments.length}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
