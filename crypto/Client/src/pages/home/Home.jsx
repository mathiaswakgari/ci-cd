import React from "react";
import Sidebar from "../../components/Sidebar";
import Messages from "../../components/Messages";


const Home = () => {
  return (
    <div className="flex sm:h-[450px] md:h-[500px] rounded-lg overflow-hidden bg-slate-700 bg-clip-padding p-7 m-10">
      <Sidebar />
      <Messages />
    </div>
  );
};

export default Home;
