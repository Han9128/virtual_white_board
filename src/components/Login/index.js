
import React from "react";
import authContext from "../../store/auth-context";
import {useContext, useEffect} from "react";
import {BASE_URL} from '../../constants'


function Login(){
    const {isLoggedIn, handleLoginClick} = useContext(authContext);

    useEffect(()=>{
        try{
            const token = localstorage.getItem(token);
            const res = await fetch(`${BASE_URL}/login`, {
                method:'POST',
                body:JSON.stringify(payload),
                headers:{
                    'Content-Type':'application/json'
                }
            })

            if(!res.ok){
                throw new Error(`Error in log in, status ${res.status}`);
            }

            const token = res.token;
            localstorage.setItem(token)
        }catch(err){
            throw new Error(`Error during POST`, err.message)
        }
    })

    return (
        <div className={classes.login}>
            {/* write code for login take input of email and password */}
        </div>
    )
}