import React, { useState } from "react";
import Avatar from "./ui/Avatar";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { MdCancel } from "react-icons/md";

const CommentDialog = ({ isOpen, setIsOpen,post }) => {
  const [isClick, setIsClick] = useState(false);
    const [commentText, setCommentText] = useState("");
    
    const changeEventHandler = (e) => {
        console.log(e.target.value)
        if (e.target.value.trim() != "") {
            setCommentText(e.target.value)
        } else {
            setCommentText("")
        }
    }

    const handleAddComment = () => {
        
    }

  if (!isOpen) return null;

  // Close the entire modal when clicking outside
  const handleClose = (e) => {
    if (e.target.id === "overlay") {
      setIsOpen(false);
    }
  };

  // Toggle three dots menu
  const handleThreeDotClick = () => {
    setIsClick(!isClick);
  };

  return (
    <div
      id="overlay"
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={handleClose} // Close when clicking outside
    >
      {/* Modal Content */}
      <div
        className="relative bg-white p-4 rounded-lg shadow-lg flex w-[700px] h-[450px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Image */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            className="w-full h-full object-cover rounded-lg"
            src={`${post?.image}`}
            alt="post_img"
          />
        </div>

        {/* Right Side: Comments Section */}
        <div className="w-1/2 flex flex-col justify-between border-l border-gray-300 p-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-300">
            <Link>
              <Avatar src={`${post.author?.profilePicture}`} name={`${post.author?.username}`} />
            </Link>

            <div className="flex flex-col justify-center items-start">
              <p className="font-semibold text-gray-800">
                <Link>{post.author?.username }</Link>
              </p>
            </div>

            {/* Three Dots Menu */}
            <button
              onClick={handleThreeDotClick}
              className="relative z-20 ml-auto"
            >
              <BsThreeDots className="text-xl" />
            </button>
          </div>

          {/* Dropdown Menu */}
          {isClick && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md w-[200px] p-4 flex flex-col items-center border">
              {/* Close Button */}
              <button
                onClick={() => setIsClick(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <MdCancel size={20} />
              </button>

              {/* Options */}
              <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md mt-2">
                Unfollow
              </button>
              <button className="w-full bg-gray-300 text-black py-2 px-4 rounded-md mt-2">
                Add to Favorite
              </button>
              <button className="w-full bg-gray-300 text-black py-2 px-4 rounded-md mt-2">
                Delete
              </button>
            </div>
          )}

          {/* Comments */}
          <div className="flex-1 overflow-y-auto mt-2 space-y-2">
            {post && (
              post.comments.map((comment) => {
                return <p className="text-gray-600">{ comment}</p>
              })
            )}
          </div>

          {/* Comment Input */}
          <div className="border-t border-gray-300 pt-3 flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={changeEventHandler}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button onClick={handleAddComment} className="rounded-md p-2 text-sm border-[1px] cursor-pointer">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
