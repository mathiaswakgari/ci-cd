import React from "react";
import SearchInput from "./SearchInput";
import Logout from "./Logout";
import Conversations from "./Conversations";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden border-r border-slate-500 p-4 flex flex-col
        ${isOpen ? "w-[250px]" : "w-0"}`}>
      {(isOpen || window.innerWidth >= 768) && (
        <>
          <div className="divider px-3"></div>
          <Conversations />
          <Logout />
        </>
      )}
    </div>
  );
};

export default Sidebar;
