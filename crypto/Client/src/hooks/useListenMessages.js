import React, { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sound/notification.mp3";
import { useAuthContext } from "../context/AuthContext";
import forgeRSADecrypt from "../util/forgeRSADecrypt";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const { messages, setMessages } = useConversation();
  const privateKey = authUser.private_key;

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      console.log("🔔 [Socket] Received message:", newMessage);

      const decryptedText =
        authUser.user_id === newMessage.sender_id
          ? forgeRSADecrypt(newMessage.message.senderMessage, privateKey)
          : forgeRSADecrypt(newMessage.message.reciverMessage, privateKey);

      const finalMessage = {
        ...newMessage,
        message: decryptedText,
        shouldShake: true,
      };

      console.log("🔐 [Decrypted] Final message to add:", finalMessage);

      setMessages((prev) => {
        const exists = prev.some(
          (msg) => msg.timestamp === finalMessage.timestamp &&
                   msg.sender_id === finalMessage.sender_id
        );
        if (exists) {
          console.log("⚠️ [Duplicate] Message already exists, skipping...");
          return prev;
        }

        const updated = [...prev, finalMessage];
        console.log("💾 [Messages Updated]:", updated);
        return updated;
      });

      const sound = new Audio(notificationSound);
      sound.play();
    };

    socket?.on("receive_message", handleReceiveMessage);

    return () => socket?.off("receive_message", handleReceiveMessage);
  }, [socket, setMessages, authUser.user_id, privateKey]);

};

export default useListenMessages;
