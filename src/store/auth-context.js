
import {createContext} from 'react';


const authContext = createContext({
    isLoggedIn:false,
    handleLoginClick:()=>{}
})

export default authContext;