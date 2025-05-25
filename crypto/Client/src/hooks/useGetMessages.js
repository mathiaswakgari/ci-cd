import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";
import forgeRSADecrypt from "../util/forgeRSADecrypt";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  const privateKey = authUser.private_key; // Get the private key from authUser

  useEffect(() => {
    const getMessage = async () => {
      if (!selectedConversation?._id) {
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/messages/${selectedConversation._id}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.warn("Expected messages array but got:", data);
          setMessages([]);
          return;
        }

        const decryptedMessages = data.map((msg) => ({
  ...msg,
  message: authUser.user_id === msg.sender_id
    ? forgeRSADecrypt(msg.message.senderMessage, privateKey)
    : forgeRSADecrypt(msg.message.reciverMessage, privateKey),
}));
        setMessages(decryptedMessages);
      } catch (error) {
        toast.error(error.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    getMessage();
  }, [selectedConversation?._id, privateKey, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
