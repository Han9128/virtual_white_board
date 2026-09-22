
import { useState } from "react";
import authContext from "./auth-context";
import { authenticateLogin, registerUser } from "../services/authApi"



function AuthProvider({ children }) {
    const [isLoggedIn, setIsLogin] = useState(()=>!!localStorage.getItem("token"));
    // const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const token = localStorage.getItem("token");
    // async function checkLogin() {
    //     try {
    //         const token = localStorage.getItem("token");
    //         if (!token) {
    //             return;
    //         }
    //         const data = await verifyToken(token);
    //         setUserData(data);
    //         setIsLogin(true);
    //         setShowDashboard(true);
    //     } catch (error) {
    //         localStorage.removeItem("token");
    //         setIsLogin(false);
    //         setShowDashboard(false);
    //         console.error(error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    // we cant make callback function of useEffect async as useEffect expects nothing or a fuction returned but async function returns promise so react gives error using async on callback of useEffect
    // useEffect(() => {
    //     console.log("check login is running everytime app mounts")
    //     checkLogin();
    // }, [])

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
            // await checkLogin();
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
        // userData,
        isLoading,
        setIsLoading,
        register,
        showRegister,
        setShowRegister,
        // checkLogin,
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