import toast from "react-hot-toast";
import { useState } from "react";
import useConversation from "../zustand/useConversation";
import forgeRSAEncrypt from "../util/forgeRSAEncrypt";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();
  const { messages, setMessages, selectedConversation, publicKey } =
    useConversation();
  const { socket } = useSocketContext(); 

  const sendMessage = async (plaintextMessage) => {
    setLoading(true);
    try {
      const recipientId = selectedConversation._id;
      const reciverPublicKey = publicKey;

      console.log(reciverPublicKey)

      if (!reciverPublicKey) {
        toast.error("Recipient public key not available.");
        return;
      }

      const encryptedReciverMessage = forgeRSAEncrypt(
        plaintextMessage,
        reciverPublicKey
      );
      const encryptedSenderMessage = forgeRSAEncrypt(
        plaintextMessage,
        authUser.public_key
      );
      socket.emit("send_message", {
        message: {
          reciverMessage: encryptedReciverMessage,
          senderMessage: encryptedSenderMessage,
        },
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
