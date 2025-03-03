import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/slice/authSlice";

const useGetUserProfile = (userId) => {
    console.log("useGetUserProfile hook is running")
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `https://instagram-clone-mu-weld.vercel.app/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
          console.log("user profile data",res.data.user)
          
          if (res.data.success) {
           
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(
          "Error while fetching the user profile inside the hook",
          error
        );
      }
      };
      fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
