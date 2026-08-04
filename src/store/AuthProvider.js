
import { useState } from "react";
import authContext from "./auth-context";
import {authenticateLogin} from "../services/authApi"



function AuthProvider({children}) {
    const [isLoggedIn, setIsLogin] = useState(false);
    const [userData, setUserData] = useState({});

    const login = async (payload) => {

        const data = await authenticateLogin(payload);
        
        setUserData(data);
        setIsLogin(true);
        localStorage.setItem("token",data.token);
    }

    const authContextValues = {
        isLoggedIn,
        login,
        userData
    }

    return (
        <authContext.Provider value={authContextValues}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;