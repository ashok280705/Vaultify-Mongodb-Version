import React, { useState ,useRef} from "react";
import UserContext from "./context";
const ContextProvider = ({ children }) => {
    const [currmanager, setcurrmanager] = useState([]);
     const [currentUser, setcurrentUser] = useState(""); // 👈 added
    return (
    <UserContext.Provider
      value={{
        currmanager, setcurrmanager,
        currentUser, setcurrentUser
      }}
    >
      {children}
    </UserContext.Provider>
);
};
export default ContextProvider;