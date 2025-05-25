import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Messages from "../../components/Messages";
import { Menu } from "lucide-react";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative">
      <button
        className="absolute top-4 left-12 z-50 btn btn-square btn-ghost"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <Menu />
      </button>

      <div className="flex h-[550px] sm:h-[450px] md:h-[500px] rounded-lg  bg-slate-700 bg-clip-padding p-7 m-10">
        <Sidebar isOpen={isSidebarOpen} />
        <Messages className="w-[500px]" />
      </div>
    </div>
  );
};

export default Home;
