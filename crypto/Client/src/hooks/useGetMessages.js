import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import useConversation from "../zustand/useConversation";
import forgeRSADecrypt from "../util/forgeRSADecrypt";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation, privateKey } =
    useConversation(); // privateKey is stored locally

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/messages/${selectedConversation._id}`,
          {
            credentials: "include", // Ensures cookies are sent with requests
          }
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const decryptedMessages = data.map((msg) => ({
          ...msg,
          message: forgeRSADecrypt(msg.message, privateKey),
        }));

        setMessages(decryptedMessages);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessage();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
