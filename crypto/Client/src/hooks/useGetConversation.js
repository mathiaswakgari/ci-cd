import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversation = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversation] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const controller = new AbortController();

    const getConversations = async () => {
      setLoading(true);
      setError(null); 
      try {
        const res = await fetch("http://localhost:5000/users", {
          credentials: "include", 
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch users");
        }

        const data = await res.json();
        setConversation(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message); 
          toast.error(error.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    getConversations();

    return () => {
      controller.abort();
    };
  }, []);

  return { loading, conversations, error };
};

export default useGetConversation;
