import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setMessages } from '../redux/slice/chatSlice'

const useGetAllMessages = () => {
    console.log("useGetAllMessages hook is running")
    const {selectedUser} = useSelector(store=>store.chat)
    const dispatch = useDispatch();
    useEffect(() => {
        
        const fetchAllMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true });
                if (res.data.success) {
                    console.log("all messages data", res.data.conversation);
                    dispatch(setMessages(res.data.conversation))
                }
            } catch (error) {
                console.log("Error while fetching all post data in frontend")
            }
            
        }
        fetchAllMessages();
    }, [selectedUser]);
  
}

export default useGetAllMessages
