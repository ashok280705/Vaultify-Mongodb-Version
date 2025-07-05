import {React,useContext} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Usercontext from "../context/context";
const Navbar = () => {
  const { currmanager, setcurrmanager } = useContext(Usercontext);
  const logout = () => {
    setcurrmanager([]);
  };

  let navigation=useNavigate()
  return (
    <nav>
      <div className="flex justify-between h-[8vh] w-full px-10 bg-gradient-to-r from-slate-600 to-green-700">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-black p-5">
            <span className="text-green-600">&lt;</span>
            <span className="text-white">VAULTI</span>
            <span className="text-green-600">FY</span>
            <span className="text-green-600">/&gt;</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-7">
            <button className="flex items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-medium px-3 py-1 rounded-lg shadow-md transition duration-300">
              <span
                dangerouslySetInnerHTML={{
                  __html: `<lord-icon
        src="https://cdn.lordicon.com/jjxzcivr.json"
        trigger="hover"
        colors="primary:#ffffff,secondary:#22c55e"
        style="width:24px;height:24px">
      </lord-icon>`,
                }}
              />
              <span>GitHub</span>
            </button>
            <button className="bg-red-600 text-white px-3 py-2 rounded-md" onClick={()=>{
              logout()
              navigation('/')
            }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
