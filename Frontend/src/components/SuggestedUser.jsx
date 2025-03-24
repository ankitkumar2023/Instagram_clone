import React from "react";
import Avatar from "./ui/Avatar";
import useGetSuggestedUser from "../hooks/useGetSuggestedUser";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { setAuthUser } from "../redux/slice/authSlice";
import { toast } from "sonner";

const SuggestedUser = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const { user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  const handleFollowOrUnFollow = async (suggesteduser) => {
    try {
      const res = await axios.post(
        `https://instagram-backend-k7w6.onrender.com/api/v1/user/followorunfollow/${suggesteduser?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        let updatedUserDetails = { ...user };

        if (user?.following.includes(suggesteduser?._id)) {
          // Unfollow logic
          updatedUserDetails.following = user.following.filter(
            (id) => id !== suggesteduser?._id
          );
          updatedUserDetails.followers = user.followers.filter(
            (id) => id !== suggesteduser?._id
          );
        } else {
          // Follow logic
          updatedUserDetails.following = [
            ...user.following,
            suggesteduser?._id,
          ];
        }

        dispatch(setAuthUser(updatedUserDetails));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error while follow or unfollow", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

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
        {suggestedUsers.map((suggesteduser, index) => (
          <div key={index} className="flex items-center justify-between">
            <Link to={`/profile/${suggesteduser?._id}`}>
              <div className="flex items-center gap-3">
                <Avatar
                  src={`${suggesteduser?.profilePicture}`}
                  name={`${suggesteduser?.username}`}
                />

                <div>
                  <p className="text-sm font-semibold">
                    {suggesteduser?.username}
                  </p>
                  <p className="text-xs text-gray-500">Suggested for you</p>
                </div>
              </div>
            </Link>
            <button
              onClick={() => handleFollowOrUnFollow(suggesteduser)}
              className="text-xs font-semibold text-blue-500 hover:text-blue-700 hover:cursor-pointer"
            >
              {user?.following.includes(suggesteduser?._id)
                ? "Following"
                : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUser;
