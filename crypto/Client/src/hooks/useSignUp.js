import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ fullname, username, password, confirmPassword, gender }) => {
    const valid = handleInputError({ fullname, username, password, confirmPassword, gender });
    if (!valid) return false;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, username, password, confirmPassword, gender }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      const loginRes = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.error || "Auto-login failed");
      }

      localStorage.setItem("user-info", JSON.stringify(loginData));
      setAuthUser(loginData);

      toast.success("Registration and login successful!");
      return true;
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

function handleInputError({ fullname, username, password, confirmPassword, gender }) {
  if (!fullname || !username || !password || !confirmPassword || !gender) {
    toast.error("Please enter all fields");
    return false;
  }
  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }
  if (password.length < 6) {
    toast.error("Password should be at least 6 characters");
    return false;
  }
  return true;
}

export default useSignUp;
