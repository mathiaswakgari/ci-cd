import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext"; // Custom Auth context
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext(); // Assuming useAuthContext provides user info

  useEffect(() => {
    if (authUser) {
      // Establish Socket.IO connections
      const socket = io("http://localhost:5000", {
        withCredentials: true,
        query: { userId: authUser.user_id }, // Pass user ID for authentication
      });

      setSocket(socket);

      // Listen for online users
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Handle incoming messages
      socket.on("receive_message", (data) => {
        console.log("New message received:", data);
        // Handle received message, e.g., update state or show in UI
      });

      // Cleanup when component unmounts or user logs out
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  // Function to send messages to the server
  const sendMessage = (message, recipientId) => {
    if (socket) {
      const encryptedMessage = encryptMessage(message); // Function to encrypt the message
      const encryptedB64 = base64Encode(encryptedMessage);
      socket.emit("send_message", {
        message: encryptedB64,
        recipient_id: recipientId,
      });
    }
  };

  // Utility to base64 encode the message
  const base64Encode = (str) => {
    return btoa(str); // JavaScript's built-in base64 encoder
  };

  // Example encryption function (replace with actual encryption logic)
  const encryptMessage = (message) => {
    // Placeholder encryption logic
    return message;
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
