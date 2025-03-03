import React, { useState } from "react";
import Avatar from "./ui/Avatar";
import { BsThreeDots } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { Bookmark, MessageCircle, Send } from "lucide-react";
import CommentDialog from "./CommentDialog";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "../redux/slice/PostSlice";
import { LuBadgeCheck } from "react-icons/lu";

const SinglePost = ({ post }) => {
  const [isClick, setIsClick] = useState(false);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLikedCount, setPostLikedCount] = useState(post.likes.length);
  const [comment,setComment] = useState(post.comments)

  console.log("user detail inside single post page", user);

  const HandlerChange = (e) => {
    console.log(e.target.value)
    if (e.target.value.trim() != "") {
      setText(e.target.value);
    } else {
      setText("");
    }
  };

  const handleThreeDotClick = () => {
    setIsClick(true);
  };

  const handleClose = () => {
    setIsClick(false);
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagram-clone-mu-weld.vercel.app/api/v1/post/delete/${post?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id != post?._id
        );
        dispatch(setPosts(updatedPost));

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const likeAndDislikeHandler = async () => {
    const userAction = liked ? "dislike" : "like";
    try {
      const res = await axios.get(
        `https://instagram-clone-mu-weld.vercel.app/api/v1/post/${post?._id}/${userAction}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPostData = posts.map((postItem) =>
          postItem?._id === post?._id
            ? {
                ...postItem,
                likes: liked
                  ? postItem.likes.filter((uId) => uId !== user?._id)
                  : [...postItem.likes, user?._id],
              }
            : postItem
        );

        dispatch(setPosts(updatedPostData)); // Update global Redux state
        setLiked(!liked); // Update local state for immediate UI change
        setPostLikedCount(liked ? postLikedCount - 1 : postLikedCount + 1);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const addCommentHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagram-clone-mu-weld.vercel.app/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("response for comment in frontend", res);

      if (res.data.success) {
        let updatedPostComments = [...comment, res.data.newComment];
        setComment(updatedPostComments);

        const updatedPostData = posts.map((postItem) =>
          postItem?._id == post?._id
            ? { ...postItem, comments: updatedPostComments }
            : postItem
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleUnfollow = () => {
    try {
    } catch (error) {}
  };

  const handleBookmark = async () => {
    try {
      const res = await axios.get(
        `https://instagram-clone-mu-weld.vercel.app/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(Error);
    }
  };

  return (
    <div className="my-6 w-full max-w-sm mx-60 relative bg-gray-100 p-2 rounded-sm">
      <div className="flex items-center justify-between gap-2">
        <Link to={`/profile/${post.author?._id}`} >
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              src={`${post.author?.profilePicture}`}
              alt="post_user_img"
              size="30px"
              name={`${post.author?.username}`}
            />
            <h1>{post.author.username}</h1>
            {
              user?._id == post.author?._id && (<LuBadgeCheck className="bg-blue-400 rounded-full text-white"/>
              )
            }

          </div>
        </Link>

        <button onClick={handleThreeDotClick} className="relative ">
          <BsThreeDots className="text-xl" />
        </button>
      </div>

      {isClick && (
        <div className="fixed inset-0  flex items-center  justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white shadow-lg rounded-md w-[200px] p-4 flex flex-col items-center relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <MdCancel size={20} />
            </button>

            {/* Unfollow Button */}
            <button
              onClick={() => handleUnfollow(id)}
              className="w-40 bg-red-500 text-white py-2 px-4 rounded-md mt-2"
            >
              Unfollow
            </button>
            <button className="w-40 bg-gray-300 text-white py-2 px-4 rounded-md mt-2">
              Add to Favourate
            </button>
            {user && user?._id == post.author?._id && (
              <button
                onClick={deletePostHandler}
                className="w-40 bg-gray-300 text-white py-2 px-4 rounded-md mt-2"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={`${post.image}`}
        alt="post_img"
      />
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart
              onClick={likeAndDislikeHandler}
              className="w-6 h-6 cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeAndDislikeHandler}
              className="w-6 h-6 cursor-pointer hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() => {
              console.log("Comment icon clicked"), setIsOpen(true);
            }}
            className="w-6 h-6 cursor-pointer hover:text-gray-600"
          />
          <Send className="w-6 h-6 cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark onClick={handleBookmark} className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{postLikedCount} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
      </p>
      {
        comment.length > 0 && (<span
          onClick={() => {
            console.log("View all comment clicked.."), setIsOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-500"
        >
          View all {comment.length} comments
        </span>)
      }
      <CommentDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        post={post}
        text={text}
        setText={setText}
        addCommentHandler={addCommentHandler}
        user={user} />
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => HandlerChange(e)}
          placeholder="Add a comment...."
          className="outline-none text-sm w-full"
        />
        {text && <span onClick={addCommentHandler} className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default SinglePost;
