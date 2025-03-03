import { createBrowserRouter, RouterProvider, } from 'react-router-dom';

import Login from './components/Login.jsx';

import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import MainLayout from './components/MainLayout.jsx';
// import Signup from "./components/Signup.jsx"

import EditProfile from './components/EditProfile.jsx';
import ChatPage from './components/ChatPage.jsx';
import {io} from "socket.io-client"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/slice/socketSlice';
import { setOnLineUsers } from './redux/slice/chatSlice';
import { setLikeNotifications } from './redux/slice/notificationSlice';
import Signup from './components/Signup.jsx';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element:<Home/>
      },
      {
        path: '/profile/:id',
        element:<Profile  />
      },
      {
        path: '/account/edit',
        element:<EditProfile/>
      },
      {
        path: '/chat',
        element:<ChatPage/>
      }
    ]
  },
  {
    path: "/signup",
    element:<Signup/>
  },
  {
    path: '/login',
    element:<Login/>
  },
  
])

function App() {
  const { user } = useSelector(store => store.auth);
  const {socket} = useSelector(store=>store.socketio)
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      //listning all the events that are comming from the backend

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnLineUsers(onlineUsers));
      });

      //for notification

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotifications(notification))
      })



      //cleanup function for-->like user dont logout but close the tab for
      //for that scenario also user should go offline
      return () => {
        socketio.close();
        dispatch(setSocket(null))
      }

    } else if(socket){
     socket.close();
      dispatch(setSocket(null))
    }
  },[user,dispatch])
  return (
    <>
      <RouterProvider router={browserRouter} />
      
    </>
  );
}



export default App
