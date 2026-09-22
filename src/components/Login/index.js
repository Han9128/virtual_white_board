
import React, { useState } from "react";
import authContext from "../../store/auth-context";
import classes from "./index.module.css";
import { Presentation,Mail,Lock } from 'lucide-react';
import {ReactComponent as Google} from "../../assets/icons/google.svg";
import {ReactComponent as Doodle} from "../../assets/icons/doodle.svg";
import { useContext } from "react";
import {Link} from "react-router";

function Login() {
    const { login, setShowRegister } = useContext(authContext);
    const [loginError, setLoginError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const isValidEmail = (email) => {
        const account = email.split('@').length - 1;
        // make sure only one @ is present and some value is present before and after @
        if(account!==1){
            return false;
        }
        if(email.includes(' ')){
            return false;
        }

        const [beforeAt, afterAt] = email.split('@');
       
        if(beforeAt.length === 0 || afterAt.length === 0) return false;


        // there must be a dot in string after @
        if(!afterAt.includes('.')){
            return false;
        }

        const dotIndex = afterAt.indexOf('.');

        // there must be some string after dot
        if(dotIndex === afterAt.length-1){
            return false;
        }

        return true;
    }

    const validate = () => {
        const errors = {};
        if(!email){
            errors.email = "Please enter an email id";
        }else if(!isValidEmail(email)){
            errors.email = "Please enter a valid email address"
        }

        if(!password){
            errors.password = "Enter your password"
        }

        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents refreshing the page on submitting the form

        const errors = validate();
        setFieldErrors(errors);
        if(Object.keys(errors).length>0) return;
        const payload = {
            email,
            password
        }

        try {
            const res = await login(payload);
            if(res.status === 401){
                setLoginError("Invalid email or password");
                return;
            }

            if(!res.ok){
                setLoginError("Something went wrong. Please try again.")
                return;
            }
        } catch (err) {
            setLoginError("Unable to connect. Check your internet and try again.")
            console.error(err.message);
        }
    }

    return (
        <div className={classes.loginBackground}>
            <div className={classes.loginContainer}>
                <div className={classes.leftSection}>
                    <div className={classes.top}>
                        <div className={classes.brandMark}>
                            <Presentation />
                        </div>
                        <h2 className={classes.logo}>Whiteboard</h2>
                    </div>
                    <div className={classes.mid}>
                        <h2>Your ideas deserve room to breathe</h2>
                        <p>Sketch, plan, and collaborate on an infinite canvas — synced across every device, the moment inspiration hits.</p>
                        <div className="doodleWrap">
                            <Doodle className={classes.doodle} />
                        </div>
                    </div>
                    <div className={classes.bottom}>
                        Trusted by developer who thinks in whiteboards
                    </div>
                </div>

                <div className={classes.rightSection}>
                    <div className={classes.authHead}>
                        <h1>Welcome back</h1>
                        <p>Login to pickup right where you left off.</p>
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        {loginError && (<div className={classes.authError}>{loginError}</div>)}
                        <div className={classes.loginFieldBox}>
                            <div className={classes.field}>
                                <label htmlFor="email">Email:</label>
                                <div className={classes.inputWrap}>
                                    <Mail className={classes.inputIcon}/>
                                    <input
                                        type="email"
                                        name="email"
                                        id="userName"
                                        className={classes.loginInput}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {fieldErrors.email && <div className={classes.fieldError}> {fieldErrors.email}</div>}
                            </div>
                            <div className={classes.field}>
                                <label htmlFor="password">Password:</label>
                                <div className={classes.inputWrap}>
                                    <Lock className={classes.inputIcon}/>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className={classes.loginInput}
                                        placeholder="••••••••"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {fieldErrors.password && <div className={classes.fieldError}> {fieldErrors.password}</div>}
                            </div>
                            <p className={classes.forgotPassword}>Forgot password?</p>
                        </div>
                        <button type="submit" className={classes.loginBtn}>Log in</button>
                    </form>
                    <div className={classes.divider}>
                        or continue with
                    </div>
                    <button className={classes.googleBtn}>
                        <Google />
                        Google
                    </button>
                    <p className={classes.register}>
                        Don't have an account?   
                        <Link to ="/register" onClick={() => setShowRegister(true)}>
                            <span className={classes.registerLink}>
                                 Create one
                            </span>
                        </Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;