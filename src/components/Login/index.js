
import React, { useState } from "react";
import authContext from "../../store/auth-context";
import classes from "./index.module.css";
import {useContext} from "react";


function Login(){
    const {login} = useContext(authContext);
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents refreshing the page on submitting the form
        const payload = {
            email,
            password
        }
        try{

            await login(payload)
        } catch(err){
            console.log(err.message);
        }
    }

    return (
        <div className={classes.loginBackground}>
            <div className={classes.loginContainer}>
                <form onSubmit={(e)=>handleSubmit(e)}>
                <div className={classes.loginFieldBox}>
                <label for="email">email:</label>
                <br />
                <input 
                type="email"
                name="email" 
                id="userName" 
                className={`${classes.username} ${classes.loginInput}`}
                onChange={(e)=>setEmail(e.target.value)}
                  />
                  <br />
                <label for="password">password:</label>
                <br/>
                <input 
                type="password"
                name="password" 
                id="password" 
                className={`${classes.username} ${classes.loginInput}`}
                onChange={(e)=>setPassword(e.target.value)}
                 />
                 <br />
                </div>
                <button type="submit" className={classes.loginBtn}>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;