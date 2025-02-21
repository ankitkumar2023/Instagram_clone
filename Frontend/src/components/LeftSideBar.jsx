import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import Avatar from './ui/Avatar'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const sideBarItems = [
    {
        icon: <Home />,
        text:"Home"
    },
    {
        icon: <Search />,
        text:"Search"
    },
    {
        icon: <TrendingUp />,
        text:"Explore"
    },
    {
        icon: <Heart />,
        text:"Notification"
    },
    {
        icon: <MessageCircle />,
        text:"Messages"
    },
    {
        icon: <PlusSquare />,
        text:"Create"
    },
    {
        icon: <Avatar size="35px"/>,
        text:"Profile"
    },
    {
        icon: <LogOut />,
        text:"Logout"
    }
]

const LeftSideBar = () => {

    const navigate = useNavigate();

    const logoutHandler = async() => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
            if (response.data.success) {
                navigate('/login')
                toast.success(response.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const sideBarHandler= (sidebar) => {
        try {
            // alert(sidebar)
            if (sidebar == "Logout") logoutHandler();
        } catch (error) {
            
        }
    }
  return (
      <div className='fixed top-0 z-10 left-0 w-[18%] h-screen border-r border-gray-300 flex flex-col  gap-5 justify-evenly pt-10 pb-10'>
          <div className='text-center text-xl font-medium from-neutral-700 font-sans'>Instagram</div>
          {
              sideBarItems.map((item,index) => {
                  return (
                      <div
                          key={index}
                          className='flex items-center gap-4 w-[90%] h-12 ml-3 pl-2   relative hover:bg-gray-200 border-gray-200 rounded-xl cursor-pointer '
                          onClick={()=>sideBarHandler(item.text)}
                      >
                          {item.icon}
                          <span>{ item.text}</span>
                      </div>
                  )
              })
      }
    </div>
  )
}

export default LeftSideBar
