
import { useState, useEffect } from "react";
import authContext from "./auth-context";
import { authenticateLogin, verifyToken } from "../services/authApi"



function AuthProvider({ children }) {
    const [isLoggedIn, setIsLogin] = useState(false);
    const [userData, setUserData] = useState({});
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
        async function checkLogin(){
            try {
                const token = localStorage.getItem("token");
                if(!token){
                    return;
                }
                const data = await verifyToken(token);
                setUserData(data);
                setIsLogin(true);
            } catch (error) {
                localStorage.removeItem("token");
                setIsLogin(false);
                console.error(error);
            }finally{
                setIsLoading(false);
            }
        }
        checkLogin();
        
    }, [])

    const login = async (payload) => {
        const data = await authenticateLogin(payload);
        setUserData(data);
        setIsLogin(true);
        localStorage.setItem("token", data);
    }

    const authContextValues = {
        isLoggedIn,
        login,
        userData,
        isLoading
    }

    return (
        <authContext.Provider value={authContextValues}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;