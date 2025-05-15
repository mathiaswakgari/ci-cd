import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversation = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversation] = useState([]);
  const [error, setError] = useState(null); // New state for error

  useEffect(() => {
    const controller = new AbortController();

    const getConversations = async () => {
      setLoading(true);
      setError(null); // Reset error before making a new request
      try {
        const res = await fetch("http://localhost:5000/users", {
          credentials: "include", // Ensures cookies are sent with requests
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
          setError(error.message); // Set the error state
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
