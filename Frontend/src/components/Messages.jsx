import React from "react";
import Avatar from "./ui/Avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessages from "../hooks/useGetAllMessages";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";

const Messages = ({ selectedUser }) => {
    useGetAllMessages();
    useGetRealTimeMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex flex-col h-full p-4">
      {/* User Info */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <Avatar src={selectedUser?.profilePicture} name={selectedUser?.username} />
          <span className="text-lg font-semibold">{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <button className="text-sm p-2 bg-blue-400 text-white rounded-md cursor-pointer">
              View Profile
            </button>
          </Link>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex flex-col gap-3 mt-4 overflow-auto">
        {messages &&
          messages.map((msg) => (
            <div key={msg?._id} className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                  msg.senderId === user?._id ? "bg-blue-400" : "bg-gray-300"
                }`}
              >
                {msg?.message}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Messages;
