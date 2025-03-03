import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Avatar from './ui/Avatar'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import store from '../redux/store'
import { setAuthUser } from '../redux/slice/authSlice'
import CreatePost from './CreatePost'
import { setPosts } from '../redux/slice/PostSlice'

const LeftSideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    

    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    
    const { likeNotifications } = useSelector(store => store.realTimeNotification);

    const logoutHandler = async() => {
        try {
            const response = await axios.get(
              "https://instagram-clone-mu-weld.vercel.app/api/v1/user/logout",
              { withCredentials: true }
            );
            if (response.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setPosts([]));
                navigate(`/login`);
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sideBarHandler = (sidebar) => {
        try {
            if (sidebar === "Logout") {
                logoutHandler();
            } else if (sidebar === "Create") {
                setIsOpen(true);
            } else if (sidebar === "Profile") {
                navigate(`/profile/${user?._id}`);
            } else if (sidebar === "Home") {
                navigate('/');
            } else if (sidebar === "Notifications") {
                setIsNotificationOpen(!isNotificationOpen);
            } else if (sidebar === "Messages") {
                navigate('/chat');
            }
        } catch (error) {
            console.log(`Error while navigating to ${sidebar}`, error);
        }
    }

    useEffect(() => {
        const closeNotificationBar = (e) => {
            if (!document.getElementById("notification-sidebar")?.contains(e.target) &&
                !document.getElementById("notification-btn")?.contains(e.target)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener("click", closeNotificationBar);
        return () => document.removeEventListener("click", closeNotificationBar);
    }, []);

    const sideBarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <PlusSquare />, text: "Create" },
        { icon: <Avatar src={user?.profilePicture} alt={user?.username + "_img"} size="35px" />, text: "Profile" },
        { icon: <LogOut />, text: "Logout" }
    ];

    return (
        <>
            {isNotificationOpen && <div className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm z-10"></div>}
            
            <div className='fixed top-0 z-20 left-0 w-[18%] h-screen border-r border-gray-300 flex flex-col gap-5 justify-evenly pt-10 pb-10 bg-white'>
                <div className='text-center text-xl font-medium text-neutral-700 font-sans'>Instagram</div>
                
                {sideBarItems.map((item, index) => (
                    <div
                        key={index}
                        id={item.text === "Notifications" ? "notification-btn" : ""}
                        className='flex items-center gap-4 w-[90%] h-12 ml-3 pl-2 relative hover:bg-gray-200 border-gray-200 rounded-xl cursor-pointer'
                        onClick={() => sideBarHandler(item.text)}
                    >
                        {item.icon}
                        <span>{item.text}</span>
                        {item.text === "Notifications" && likeNotifications.length > 0 && (
                            <div className="absolute top-0 right-0 -mt-2 mr-16 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {likeNotifications.length}
                            </div>
                        )}
                    </div>
                ))}
                <CreatePost isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>

            {isNotificationOpen && (
                <div 
                    id="notification-sidebar"
                    className="fixed top-0 right-[57%] w-[25%] h-screen bg-white shadow-lg border-l border-gray-300 p-4 overflow-y-auto z-20"
                >
                    <h2 className="text-lg font-semibold border-b pb-2">Notifications</h2>
                    
                    {likeNotifications.length === 0 ? (
                        <p className="text-gray-500 mt-3">No new notifications</p>
                    ) : (
                        likeNotifications.map((notification, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border-b hover:bg-gray-100">
                                <Avatar src={notification?.userDetails?.profilePicture} />
                                <p className="text-sm">
                                    <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    );
}

export default LeftSideBar;
