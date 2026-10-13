
import { useState, useCallback} from "react";
import authContext from "./auth-context";
import { authenticateLogin, registerUser } from "../services/authApi";



function AuthProvider({ children }) {
    const [token,setToken] = useState(()=>localStorage.getItem("token") );
    const isLoggedIn = !!token; 
    const [authMessage, setAuthMessage] = useState(null);
    const register = async (payload) => {
            const data = await registerUser(payload);
            return data;
    }

    const login = async (payload) => {
            const t = await authenticateLogin(payload);
            localStorage.setItem("token", t);
            setToken(t)
    }

    const logout = useCallback((reason) => {
        localStorage.removeItem('token');
        setAuthMessage(reason?? null)
        setToken(null);
    }
    ,[])

    const clearAuthMessage = useCallback(()=> setAuthMessage(null),[])


    const authContextValues = {
        isLoggedIn,
        login,
        register,
        token,
        logout,
        authMessage,
        clearAuthMessage
    }

    return (
        <authContext.Provider value={authContextValues}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;