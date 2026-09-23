
import { useState } from "react";
import authContext from "./auth-context";
import { authenticateLogin, registerUser } from "../services/authApi"



function AuthProvider({ children }) {
    const [isLoggedIn, setIsLogin] = useState(()=>!!localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const token = localStorage.getItem("token");

    const register = async (payload) => {
        try {
            const data = await registerUser(payload);
            setShowRegister(false);
            return data;
        } catch (err) {
            throw new Error(err.message)
        }
    }

    const login = async (payload) => {
        try{
            const token = await authenticateLogin(payload);
            if(token.status){
                return token;
            }
            localStorage.setItem("token", token);
            setIsLogin(true);
        }catch(err){
            console.error(err.message);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsLogin(false);
    }

    const authContextValues = {
        isLoggedIn,
        login,
        isLoading,
        setIsLoading,
        register,
        showRegister,
        setShowRegister,
        showDashboard,
        setShowDashboard,
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