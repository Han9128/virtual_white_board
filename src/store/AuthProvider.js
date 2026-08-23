
import { useState, useEffect } from "react";
import authContext from "./auth-context";
import { authenticateLogin, verifyToken, registerUser } from "../services/authApi"



function AuthProvider({ children }) {
    const [isLoggedIn, setIsLogin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const token = localStorage.getItem("token");
    async function checkLogin() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
            const data = await verifyToken(token);
            setUserData(data);
            setIsLogin(true);
            setShowDashboard(true);
        } catch (error) {
            localStorage.removeItem("token");
            setIsLogin(false);
            setShowDashboard(false);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    // we cant make callback function of useEffect async as useEffect expects nothing or a fuction returned but async function returns promise so react gives error using async on callback of useEffect
    useEffect(() => {
        checkLogin();

    }, [])

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
        const token = await authenticateLogin(payload);
        setIsLogin(true);
        setShowDashboard(true);
        localStorage.setItem("token", token);
        await checkLogin();
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsLogin(false);
    }

    const authContextValues = {
        isLoggedIn,
        login,
        userData,
        isLoading,
        register,
        showRegister,
        setShowRegister,
        checkLogin,
        showDashboard,
        setShowDashboard,
        token,
        logout
    }

    return (
        <authContext.Provider value={authContextValues}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;