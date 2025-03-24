import React, { useEffect, useRef, useState } from "react";
import DialogBoxModal from "./ui/DialogBox";
import Avatar from "./ui/Avatar";
import { useDispatch, useSelector } from "react-redux";
import readFileAsDataURL from "./lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "../redux/slice/PostSlice";

const CreatePost = ({ isOpen, setIsOpen }) => {
  const [captionText, setCaptionText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {posts} = useSelector((store)=>store.post)
  const { user } = useSelector((store) => store.auth);
  const inputRef = useRef();

  const dispatch = useDispatch();

  const FileChangeHandler = async (e) => {
    console.log("files in createPost page", e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const dataURL = await readFileAsDataURL(file);
      // console.log("image dataUrl",dataURL)
      setImagePreview(dataURL);
    }
  };
 

  const createPostHandler = async (e) => {
    setLoading(true)
    const formData = new FormData();
    formData.append("caption", captionText)
    
    if(imagePreview) formData.append("image",uploadedFile)
      try {
        const res = await axios.post(
          `https://instagram-backend-k7w6.onrender.com/api/v1/post/addpost`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setPosts([res.data.post,...posts]))
          toast.success(res.data.message)
          setTimeout(() => {
            //   console.log(uploadedFile, captionText);
              setLoading(false);
              setIsOpen(false); // Close dialog after posting
            }, 2000);
        }
        
      } catch (error) {
        toast.error(error.response.data.message)
      }
   
  };

  return (
    <DialogBoxModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col w-full">
        {/* Title */}
        <p className="text-center font-bold text-xl">Create a post</p>

        {/* User Info */}
        <div className="flex items-center gap-2 mt-2">
          <Avatar src={user?.profilePicture} size="35px" alt={`${user?.username}_img`} />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium">{user?.username || "username"}</p>
            <span className="text-sm font-light">{user?.bio || "bio"}</span>
          </div>
        </div>

        {/* Caption Input */}
        <textarea
          value={captionText}
          className="w-full pl-2 mt-3 outline-none border-none focus:ring-0 text-md resize-none"
          placeholder="Enter your Caption Here ..."
          onChange={(e) => setCaptionText(e.target.value)}
        />

        {/* Image Preview Section */}
        {imagePreview && (
          <div className="w-full flex justify-center items-center overflow-hidden rounded-lg mt-3">
            <img src={imagePreview} alt="preview_img" className="max-w-full max-h-[50vh] object-contain rounded-lg" />
          </div>
        )}

        {/* Hidden File Input */}
        <input ref={inputRef} type="file" className="hidden" onChange={FileChangeHandler} />

        {/* Select Image & Post Button */}
        <div className="mt-4 w-full flex flex-col items-center">
          <button
            onClick={() => inputRef.current.click()}
            className="p-2 bg-blue-400 rounded-md text-white hover:bg-blue-500"
          >
            Select from device
          </button>

          {/* Show Post Button Only After Image is Selected */}
          {imagePreview && (
            <button
              onClick={createPostHandler}
              type="submit"
              className="w-full max-w-[300px] font-medium p-2 bg-purple-500 text-white rounded-xl mt-4 hover:bg-green-600 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </button>
          )}
        </div>
      </div>
    </DialogBoxModal>
  );
};

export default CreatePost;
