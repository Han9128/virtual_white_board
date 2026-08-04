
import {useState} from "react";
import authContext from "./auth-context";


function AuthProvider(){
    const [isLoggedIn, setIsLogin] = useState(false);

    const handleLoginClick = ()=>{
        setIsLogin(true);
    }

    const authContextValues = {
        isLoggedIn,
        handleLoginClick
    }

    return (
        <authContext.Provider value={authContextValues}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;