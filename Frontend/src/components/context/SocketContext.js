import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setOnLineUsers } from "../redux/slice/chatSlice";
import { setLikeNotifications } from "../redux/slice/notificationSlice";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const socketio = io("https://instagram-backend-k7w6.onrender.com", {
        query: { userId: user?._id },
        transports: ["websocket"],
      });

      setSocket(socketio);

      // Listening for online users
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnLineUsers(onlineUsers));
      });

      // Listening for notifications
      socketio.on("notification", (notification) => {
        dispatch(setLikeNotifications(notification));
      });

      // Cleanup when unmounting
      return () => {
        socketio.close();
        setSocket(null);
      };
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to use the Socket context
export const useSocket = () => useContext(SocketContext);
