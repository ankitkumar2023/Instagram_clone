import React, { useState } from "react";
import Avatar from "./ui/Avatar";
import { CiSettings } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { Heart, MessageCircle } from "lucide-react";
import CommentDialog from "./CommentDialog";
import axios from "axios";
import { setAuthUser } from "../redux/slice/authSlice";
import { toast } from "sonner";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { userProfile } = useSelector((store) => store.auth);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isactiveTab, setActiveTab] = useState("Posts");

  // Determine button text based on relationship
  const isFollowing = user?.following.includes(userProfile?._id);
  const isFollowBack = userProfile?.following.includes(user?._id) && !isFollowing;
  const buttonText = isFollowing ? "Following" : isFollowBack ? "Follow Back" : "Follow";

  // Follow/Unfollow function
  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        let updatedUser = { ...user };
        let updatedUserProfile = { ...userProfile };

        if (isFollowing) {
          // Unfollow logic
          updatedUser.following = updatedUser.following.filter(id => id !== userProfile?._id);
          updatedUserProfile.followers = updatedUserProfile.followers.filter(id => id !== user?._id);
        } else {
          // Follow logic
          updatedUser.following = [...updatedUser.following, userProfile?._id];
          updatedUserProfile.followers = [...updatedUserProfile.followers, user?._id];
        }

        // Update Redux
        dispatch(setAuthUser(updatedUser));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error in follow/unfollow:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center py-10 bg-gray-50">
      <div className="w-[900px]">
        {/* Profile Header */}
        <div className="flex items-center justify-between pb-8 border-b">
          <div className="w-36 h-36 ml-36">
            <Avatar
              src={`${userProfile?.profilePicture}`}
              name={`${userProfile?.username}`}
              alt="user_profile_pic"
              size="150px"
            />
          </div>

          <div className="flex-1 ml-10">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold">{userProfile?.username}</h2>
              {user?._id === userId ? (
                <div className="flex gap-2">
                  <button onClick={() => navigate('/account/edit')}
                    className="text-sm bg-gray-200 px-4 py-1 rounded-md hover:bg-gray-300">
                    Edit Profile
                  </button>
                  <button className="text-sm bg-gray-200 px-4 py-1 rounded-md hover:bg-gray-300">
                    View archive
                  </button>
                  <CiSettings className="text-2xl cursor-pointer" />
                </div>
              ) : (
                <button
                  onClick={handleFollowOrUnfollow}
                  className={`text-sm px-4 py-1 rounded-md text-white ${
                    isFollowing ? "bg-gray-300 hover:bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                  }`}>
                  {buttonText}
                </button>
              )}
            </div>

            <div className="flex space-x-6 mt-4">
              <span><strong>{userProfile?.posts?.length || 0}</strong> posts</span>
              <span><strong>{userProfile?.followers?.length || 0}</strong> followers</span>
              <span><strong>{userProfile?.following?.length || 0}</strong> following</span>
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
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer py-2 ${
                isactiveTab === tab ? "font-bold border-black border-t-2" : "border-transparent border-t-2"
              }`}>
              {tab}
            </span>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 mt-6">
          {userProfile?.posts?.length > 0 ? (
            userProfile.posts.map((post) => (
              <div key={post?._id} className="relative w-full h-130 bg-gray-300 group">
                <img src={post.image} className="w-full h-full object-cover" alt="Post" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity">
                  <div className="flex items-center text-white space-x-6">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full col-span-3">No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
