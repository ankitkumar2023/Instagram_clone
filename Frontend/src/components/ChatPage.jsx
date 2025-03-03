import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./ui/Avatar";
import { setMessages, setSelectedUser } from "../redux/slice/chatSlice.js";
import { MessageCircleCode, Send } from "lucide-react";
import Messages from "./Messages.jsx";
import axios from "axios"

const ChatPage = () => {
  const [textMessage,setTextMessage] = useState("")
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const { selectedUser, onLineUsers ,messages} = useSelector((store) => store.chat);

 
  const dispatch = useDispatch();

  const sendMessageHandler = async(receiverId) => {
    try {
      const res = await axios.post(
        `https://instagram-clone-mu-weld.vercel.app/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("")
      }
    } catch (error) {
      console.log("Error while sending message from the chatpage",error)
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null))
      dispatch(setMessages([]))
    }
  },[])


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for suggested users */}
      <aside className="w-[350px] h-full ml-[18%] bg-white shadow-lg border-r border-gray-300 overflow-hidden">
        <h1 className="font-bold text-lg px-6 py-4">{user?.username}</h1>
        <hr className="border-gray-300" />
        <div className="overflow-y-auto h-[calc(100%-50px)] custom-scrollbar">
          {suggestedUsers.map((singleUser, index) => {
              const isOnline = onLineUsers.includes(singleUser?._id);
              
            return (
              <div
                key={index}
                onClick={() => dispatch(setSelectedUser(singleUser))}
                className="flex gap-3 items-center p-4 hover:bg-gray-100 cursor-pointer transition duration-200"
              >
                <Avatar
                  src={singleUser?.profilePicture}
                  name={singleUser?.username}
                />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {singleUser?.username}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isOnline ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Chat Area */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full  bg-white shadow-md">
          {/* Chat Header */}
          {/* Chat Header */}
          <div className="flex gap-3 items-center px-4 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar
              src={selectedUser?.profilePicture}
              name={selectedUser?.username}
            />
            <div className="flex flex-col">
              <span className="text-md font-semibold">
                {selectedUser?.username}
              </span>

              {/* ✅ Fix: Use the same logic as in the sidebar */}
              <span
                className={`text-sm font-medium ${
                  onLineUsers.includes(selectedUser?._id)
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {onLineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Messages Section */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {/* Messages will be shown here */}
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Chat Input */}
          <div className="flex items-center p-4 border-t border-gray-300 bg-gray-50">
            <input
              type="text"
              value={textMessage}
              onChange={(e)=> setTextMessage(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Type your messages..."
            />
            <button
              onClick={()=>sendMessageHandler(selectedUser?._id)}
              className="ml-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </section>
      ) : (
        <section className="flex-1 flex items-center justify-center text-gray-500 bg-white shadow-md">
          <div className="flex flex-col items-center justify-center mx-auto">
            <MessageCircleCode className="w-20 h-20 text-gray-400" />
            <h1 className="mt-4 text-xl font-semibold">Your Messages</h1>
            <p className="text-md">Select a chat to start messaging</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ChatPage;
