import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { io } from "socket.io-client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/slice/socketSlice';
import { setOnLineUsers } from './redux/slice/chatSlice';
import { setLikeNotifications } from './redux/slice/notificationSlice';

import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import MainLayout from './components/MainLayout.jsx';
import EditProfile from './components/EditProfile.jsx';
import ChatPage from './components/ChatPage.jsx';

// Define Routes
const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile/:id',
        element: <Profile />
      },
      {
        path: '/account/edit',
        element: <EditProfile />
      },
      {
        path: '/chat',
        element: <ChatPage />
      }
    ]
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      console.log("🟢 Connecting to Socket.io with userId:", user?._id);

      const socketio = io("https://instagram-backend-k7w6.onrender.com", {
        query: { userId: user?._id },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      // Listening for online users
      socketio.on("getOnlineUsers", (onlineUsers) => {
        console.log("📡 Received Online Users List:", onlineUsers);
        dispatch(setOnLineUsers(onlineUsers));
      });

      // Listening for notifications
      socketio.on("notification", (notification) => {
        console.log("🔔 New Notification:", notification);
        dispatch(setLikeNotifications(notification));
      });

      // Cleanup function when the user logs out or the tab closes
      return () => {
        console.log("🔴 Disconnecting socket...");
        socketio.disconnect();
        dispatch(setSocket(null));
      };

    } else if (socket) {
      console.log("🔴 Closing socket due to logout...");
      socket.disconnect();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
