import React, { useState, useEffect, useRef } from "react";
import Avatar from "./ui/Avatar";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";
import { LuBadgeCheck } from "react-icons/lu";

const CommentDialog = ({ isOpen, setIsOpen, post, text, setText, addCommentHandler,user }) => {
  const [isClick, setIsClick] = useState(false);
  const textAreaRef = useRef(null);
  const dialogRef = useRef(null);


  // Close the modal when clicking outside
  const handleClose = (e) => {
    if (e.target.id === "overlay") {
      setIsOpen(false);
    }
  };

  // Toggle the three dots menu
  const handleThreeDotClick = () => {
    setIsClick(!isClick);
  };

  // Auto-expand textarea as the user types
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Adjust modal height dynamically based on content
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.style.height = "auto";
      dialogRef.current.style.height = `${dialogRef.current.scrollHeight}px`;
    }
  }, [post?.comments, text]);

  if (!isOpen) return null;

  return (
    <div
      id="overlay"
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        className="relative bg-white p-4 rounded-lg shadow-lg flex flex-col sm:flex-row w-full sm:w-[700px] max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Image */}
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          <img
            className="w-full h-full object-cover rounded-lg"
            src={post?.image}
            alt="post_img"
          />
        </div>

        {/* Right Side: Comments Section */}
        <div className="w-full sm:w-1/2 flex flex-col justify-between border-l border-gray-300 p-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-300">
            <Link>
              <Avatar src={post.author?.profilePicture} name={post.author?.username} />
            </Link>
            <p className="font-semibold text-gray-800">
              <Link>{post.author?.username}</Link>
            </p>
            {
              user?._id == post.author?._id && (<LuBadgeCheck className="bg-blue-400 rounded-full text-white"/>)
            }

            {/* Three Dots Menu */}
            <button onClick={handleThreeDotClick} className="ml-auto">
              <BsThreeDots className="text-xl" />
            </button>
          </div>

          {/* Dropdown Menu */}
          {isClick && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md w-[200px] p-4 flex flex-col items-center border">
              <button onClick={() => setIsClick(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <MdCancel size={20} />
              </button>
              <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md mt-2">Unfollow</button>
              <button className="w-full bg-gray-300 text-black py-2 px-4 rounded-md mt-2">Add to Favorite</button>
              {
                user && user?._id == post.author?._id && (
                  <button className="w-full bg-gray-300 text-black py-2 px-4 rounded-md mt-2">Delete</button>
                )
              }
              
            </div>
          )}

          {/* Comments */}
          <div className="flex-1 overflow-y-auto mt-2 space-y-2">
            {post?.comments?.map((singleCommentObj, index) => (
              <div key={index} className="flex items-start gap-2">
                <Avatar src={singleCommentObj.author.profilePicture} size="23px" />
                <p className="text-gray-600 font-medium text-sm break-words max-w-full">
                  {singleCommentObj.text}
                </p>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="border-t border-gray-300 pt-3 flex gap-2">
            <textarea
              ref={textAreaRef}
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none overflow-hidden"
            />
            <button onClick={addCommentHandler} className="rounded-md p-2 text-sm border-[1px] cursor-pointer hover:bg-[#D98324] hover:text-white">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
