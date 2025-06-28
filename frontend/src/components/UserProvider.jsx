import { useState } from "react";
import UserContext from "./UserContext";

import React from 'react'

const UserProvider = ({children}) => {
    const [user, setUser] = useState();

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token);
        }
    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        }   
    return (
        <UserContext.Provider value={{user, login, logout}}>
            {children}
        </UserContext.Provider>
    )
    }

export default UserProvider