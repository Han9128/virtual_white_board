
import React, { useState, useContext } from "react";
import classes from './index.module.css';
import authContext from "../../store/auth-context";
import { Presentation } from 'lucide-react';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("")
    const { register, setShowRegister } = useContext(authContext)


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError("password doesn't match");
            return;
        }

        setPasswordError(false);
        const payload = {
            name: name,
            email: email,
            password: password
        }
        try {
            await register(payload)
        } catch (err) {
            // throw new Error(err.message)
            // we use throw when this function is being called by someone and they will handle the error so we pass (throw) the error to that, here handleSubmit is called when 
            // form is submitted so no where this function is called again so instead of throwing just catch it here and log
            setPasswordError(err.message);
            console.error(err.message);
        }
    }

    return (
        <div className={classes.registerBackground}>
            <div className={classes.registerContainer}>
                {
                    /* react passes event in handleSubmit by default it internally send handleSubmit(event) so no need to pass it manually */
                    // in js for is a reserved keyword so we use htmlFor which react finally conver in for while rendering
                }
                <div className={classes.leftSection}>
                    <div className={classes.top}>
                        <div className={classes.brandMark}>
                            <Presentation />
                        </div>
                        <h2 className={classes.logo}>Whiteboard</h2>
                    </div>
                    <div className={classes.mid}>
                        <h2>Start sketching in under a minute.</h2>
                        <p>Create your free account and get an infinite canvas that's always synced and ready when you are.</p>
                        <ul className={classes.checkList}>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.15)">
                                </circle>
                                    <path d="m8 12.5 2.5 2.5L16 9" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    </path>
                                </svg>
                                Unlimited Canvases
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.15)">
                                </circle>
                                    <path d="m8 12.5 2.5 2.5L16 9" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    </path>
                                </svg>
                                Real-time collaboration
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.15)">
                                </circle>
                                    <path d="m8 12.5 2.5 2.5L16 9" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    </path>
                                </svg>
                                Free forever, no card needed
                            </li>
                        </ul>
                    </div>
                    <div className={classes.bottom}>
                        Trusted by developer who thinks in whiteboards
                    </div>
                </div>
                <div className={classes.rightSection}>
                    <div className={classes.authHead}>
                        <h1>Create your account</h1>
                        <p>It only takes a minute to gest started.</p>
                    </div>

                    <form className={classes.registerForm} onSubmit={handleSubmit}>
                        <div className={classes.registerFieldBox}>
                            <div className={classes.field}>
                                <label htmlFor="userName">Full name:</label>
                                <div className={classes.inputWrap}>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.6">
                                        </circle>
                                        <path d="M5 20c1.2-4 4-5.8 7-5.8s5.8 1.8 7 5.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                                        </path>
                                    </svg>
                                    <input
                                        type="text"
                                        name="name"
                                        id="userName"
                                        className={classes.registerInput}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="john doe"
                                    />
                                </div>
                            </div>
                            <div className={classes.field}>
                                <label htmlFor="userEmail">Email:</label>
                                <div className={classes.inputWrap}>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M4 6h16v12H4z" stroke="currentColor" stroke-width="1.6"></path>
                                        <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.6"></path>
                                    </svg>
                                    <input
                                        type="email"
                                        name="email"
                                        id="userEmail"
                                        className={classes.registerInput}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div className={classes.field}>
                                <label htmlFor="password">Password:</label>
                                <div className={classes.inputWrap}>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"></rect>
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.6"></path>
                                    </svg>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className={classes.registerInput}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className={classes.field}>
                                <label htmlFor="cnfpassword">Confirm password:</label>
                                <div className={classes.inputWrap}>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"></rect>
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.6"></path>
                                    </svg>
                                    <input
                                        type="password"
                                        name="password"
                                        id="cnfpassword"
                                        className={classes.registerInput}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {passwordError && <p className={classes.passwordError}>{passwordError}</p>}
                            </div>
                        </div>
                        <button type="submit" className={classes.registerBtn}>Create account</button>
                    </form>
                    <p className={classes.login}>
                        Already have an account?
                        <a href="#/login" onClick={() => setShowRegister(false)}>
                            <span className={classes.loginLink}>
                                Log in
                            </span>
                        </a></p>
                </div>
            </div>
        </div>
    )
}

export default Register;