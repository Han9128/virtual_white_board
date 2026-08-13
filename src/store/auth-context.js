
import {createContext} from 'react';


const authContext = createContext({
    isLoggedIn:false,
    token:null,
    handleLoginClick:()=>{}
})

export default authContext;