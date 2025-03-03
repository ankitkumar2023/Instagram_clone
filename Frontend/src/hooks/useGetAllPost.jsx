import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPosts } from '../redux/slice/PostSlice'

const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(
                  "https://instagram-clone-mu-weld.vercel.app/api/v1/post/all",
                  { withCredentials: true }
                );
                if (res.data.success) {
                    console.log("all post data", res.data);
                    dispatch(setPosts(res.data.posts))
                }
            } catch (error) {
                console.log("Error while fetching all post data in frontend")
            }
            
        }
        fetchAllPost();
    }, []);
  
}

export default useGetAllPost
