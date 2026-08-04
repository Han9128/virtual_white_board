
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

        await login(payload)
    }

    return (
        <div className={classes.login-background}>
            <div className={classes.login-container}>
                <form onSubmit={(e)=>handleSubmit(e)}>
                <div className={classes.login-field-box}>
                <label>userName:</label>
                <input 
                name="email" 
                id="userName" 
                className={`${classes.username} ${classes.login-input}`}
                onChange={(e)=>setEmail(e.target.value)}
                  />
                <label>password:</label>
                <input 
                name="password" 
                id="password" 
                className={`${classes.username} ${classes.login-input}`}
                onChange={(e)=>setPassword(e.target.value)}
                 />
                </div>
                <button type="submit" className={classes.login-btn}>Login</button>
                </form>
            </div>
        </div>
    )
}