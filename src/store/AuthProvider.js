
import { useState } from "react";
import authContext from "./auth-context";
import { authenticateLogin, registerUser } from "../services/authApi"



function AuthProvider({ children }) {
    const token = localStorage.getItem("token");
    const [isLoggedIn, setIsLogin] = useState(!!token);

    const register = async (payload) => {
            const data = await registerUser(payload);
            return data;
    }

    const login = async (payload) => {
            const token = await authenticateLogin(payload);
            localStorage.setItem("token", token);
            setIsLogin(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsLogin(false);
    }

    const authContextValues = {
        isLoggedIn,
        login,
        register,
        token,
        logout,
        setIsLogin
    }

    return (
        <authContext.Provider value={authContextValues}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;