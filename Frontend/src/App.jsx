import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/Login';

import Home from './components/Home';
import Profile from './components/Profile';
import MainLayout from './components/MainLayout';

import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import {io} from "socket.io-client"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/slice/socketSlice';
import { setOnLineUsers } from './redux/slice/chatSlice';

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

      //listning all the events that are commin g=from the backend

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnLineUsers(onlineUsers));
      });

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
