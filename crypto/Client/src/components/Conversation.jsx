import React, { useEffect } from "react";
import useConversation from "../zustand/useConversation"; // Assuming this is for state management
import { useSocketContext } from "../context/SocketContext";

const Conversation = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation, setPublicKey } =
    useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  useEffect(() => {
    if (isSelected && conversation._id) {
      const fetchPublicKey = async () => {
        try {
          const response = await fetch(`http://localhost:5000/user/${conversation._id}/public-key`);

          if (!response.ok) {
            throw new Error("Failed to fetch public key");
          }
          const data = await response.json();
          console.log(data);

          if (data.public_key) {
            setPublicKey(data.public_key);
          } else {
            console.error("Public key not found.");
          }
        } catch (error) {
          console.error("Error fetching public key:", error);
        }
      };

      fetchPublicKey();
    }
  }, [isSelected, conversation._id, setPublicKey]);

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-slate-600 rounded p-2 py-1 cursor-pointer ${
          isSelected ? "bg-slate-600" : ""
        }`}
        onClick={() => {
          setSelectedConversation(conversation);
        }}>
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={conversation.image} alt="profile-image" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="text-gray-300">{conversation.username}</p>
            <span></span>
          </div>
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
