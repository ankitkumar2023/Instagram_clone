import React, { useRef, useState } from 'react'
import Avatar from './ui/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../redux/slice/authSlice';
import { toast } from 'sonner';

const EditProfile = () => {
    const { user } = useSelector(store => store.auth);
    const imageRef = useRef();
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio || '',
        gender: user?.gender || ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePhoto: file });
        }
    }

    const GenderChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }

    const editProfileHandler = async () => {

        // console.log("Updated Input:", input);

        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        
        if (input.profilePhoto) {
            formData.append("profilePhoto",input.profilePhoto)
        }
        try {
            setLoading(true)
            const res = await axios.post(
              `http://localhost:8000/api/v1/user/profile/edit`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
              }
            );
            console.log("updated user data in edit page",res.data)
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    gender: res.data.user?.gender,
                    profilePicture: res.data.user?.profilePicture
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`)

                toast.success(res.data.message)
            }
        } catch (error) {
            console.log("Error while editing the user profile");
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className='flex max-w-2xl mx-auto px-10 py-8'>
            <section className='flex flex-col gap-6 w-full bg-white shadow-md p-6 rounded-lg'>
                <h1 className='font-bold text-2xl text-gray-800'>Edit Profile</h1>

                {/* Profile Section */}
                <div className='flex items-center justify-between bg-gray-100 rounded-lg p-5'>
                    <div className='flex items-center'>
                        <Avatar src={user?.profilePicture} name={`${user?.username}`} />
                        <div className='flex flex-col ml-4'>
                            <h1 className='font-bold text-lg text-gray-900'>{user?.username}</h1>
                            <span className='text-gray-600 text-sm'>{user?.bio || "Bio here..."}</span>
                        </div>
                    </div>
                    
                    <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
                    <button 
                        onClick={() => imageRef.current.click()} 
                        className='bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200'>
                        Change Photo
                    </button> 
                </div>

                {/* Bio Section */}
                <div>
                    <h1 className='font-semibold text-gray-700 mb-2'>Bio</h1>
                    <textarea 
                        name="bio" 
                        value={input.bio}
                        onChange={(e) => setInput({ ...input, bio: e.target.value })}
                        className='w-full min-h-[80px] max-h-32 p-3 bg-gray-100 rounded-md focus:ring-0 focus:outline-none border border-gray-300 focus:border-gray-400 transition duration-200'
                        placeholder="Write something about yourself..."
                    />
                </div>

                {/* Gender Section */}
                <div>
                    <h1 className='font-semibold text-gray-700 mb-2'>Gender</h1>
                    <select 
                        value={input.gender} 
                        onChange={(e) => GenderChangeHandler(e.target.value)} 
                        className='w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 transition duration-200'>
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Submit Button */}
                {
                    loading ? (
                        <button className='bg-purple-500 text-white font-semibold rounded-md px-4 py-2 hover:bg-fuchsia-800 transition duration-200 w-full mt-4'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait
                        </button>
                    ) : (
                        <button 
                            onClick={editProfileHandler}
                            className='bg-purple-500 text-white font-semibold rounded-md px-4 py-2 hover:bg-fuchsia-800 transition duration-200 w-full mt-4'>
                            Save Changes
                        </button>
                    )
                }
            </section>
        </div>
    )
}

export default EditProfile;
