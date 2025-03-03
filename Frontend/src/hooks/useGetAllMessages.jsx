import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setMessages } from '../redux/slice/chatSlice'

const useGetAllMessages = () => {
    console.log("useGetAllMessages hook is running")
    const { selectedUser } = useSelector(store => store.chat)
    console.log("selected user",selectedUser)
    const dispatch = useDispatch();
    useEffect(() => {
        if (!selectedUser) {
            dispatch(setMessages([])); // Clear messages when no user is selected
            return;
        }
    
        const fetchAllMessages = async () => {
            try {
                dispatch(setMessages([])); // Clear messages before fetching new ones
                const res = await axios.get(
                  `https://instagram-clone-mu-weld.vercel.app/api/v1/message/all/${selectedUser._id}`,
                  { withCredentials: true }
                );
                if (res.data.success) {
                    dispatch(setMessages(res.data.conversation));
                }
            } catch (error) {
                console.log("Error while fetching all message data in frontend");
            }
        };
    
        fetchAllMessages();
    }, [selectedUser, dispatch]);
    
  
}

export default useGetAllMessages
