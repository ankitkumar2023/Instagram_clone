import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/slice/authSlice";

const useGetSuggestedUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/user/suggested",
          { withCredentials: true }
        );

        if (res.data.success) {
          console.log("all suggested user", res.data);
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log("Error while fetching all the suggested User", error);
      }
      };
      fetchSuggestedUser()
  }, []);
};

export default useGetSuggestedUser;
