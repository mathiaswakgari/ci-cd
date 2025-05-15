import toast from "react-hot-toast";
import { useState } from "react";
import useConversation from "../zustand/useConversation";
import forgeRSAEncrypt from "../util/forgeRSAEncrypt";
import { useSocketContext } from "../context/SocketContext";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation, publicKey } =
    useConversation();
  const { socket } = useSocketContext(); // ✅ fixed destructuring

  const sendMessage = async (plaintextMessage) => {
    setLoading(true);
    try {
      const recipientId = selectedConversation._id;

      if (!publicKey) {
        toast.error("Recipient public key not available.");
        return;
      }

      const encryptedMessage = forgeRSAEncrypt(plaintextMessage, publicKey);
      console.log("Encrypted message:", encryptedMessage);
      socket.emit("send_message", {
        message: encryptedMessage,
        recipient_id: recipientId,
      });
      socket.once("receive_message", (msg) => {
        if (msg.recipient_id === recipientId) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    } catch (err) {
      toast.error("Failed to send message: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;
