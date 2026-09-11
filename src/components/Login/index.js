
import React, { useState } from "react";
import authContext from "../../store/auth-context";
import classes from "./index.module.css";
import { Presentation } from 'lucide-react';
import { useContext } from "react";


function Login() {
    const { login, setShowRegister } = useContext(authContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents refreshing the page on submitting the form
        const payload = {
            email,
            password
        }
        try {

            await login(payload)
        } catch (err) {
            console.log(err.message);
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
                            <svg viewBox="0 0 280 110" fill="none">
                                <path d="M15 60c25-35 55 5 45 25s-50-5-30-30 60-15 65 10" stroke="rgba(255,255,255,0.55)" stroke-width="3" stroke-linecap="round" fill="none"></path>
                                <rect x="140" y="20" width="55" height="34" rx="4" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"></rect>
                                <circle cx="230" cy="35" r="18" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"></circle>
                                <path d="M150 75 230 65" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="4 5" stroke-linecap="round"></path>
                            </svg>
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
                        <div className={classes.loginFieldBox}>
                            <div className={classes.field}>
                                <label htmlFor="email">Email:</label>
                                <div className={classes.inputWrap}>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M4 6h16v12H4z" stroke="currentColor" stroke-width="1.6"></path>
                                        <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.6"></path>
                                    </svg>
                                    <input
                                        type="email"
                                        name="email"
                                        id="userName"
                                        className={classes.loginInput}
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
                                        className={classes.loginInput}
                                        placeholder="••••••••"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                            </div>
                            <p className={classes.forgotPassword}>Forgot password?</p>
                        </div>
                        <button type="submit" className={classes.loginBtn}>Log in</button>
                    </form>
                    <div className={classes.divider}>
                        or continue with
                    </div>
                    <button className={classes.googleBtn}>
                        <svg viewBox="0 0 48 48" width="16" height="16">
                            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.4 5.3 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z">
                            </path>
                            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.4 5.3 29.5 3 24 3 16.3 3 9.6 7.3 6.3 14.7z">
                            </path>
                            <path fill="#4CAF50" d="M24 45c5.4 0 10.2-1.9 13.9-5.1l-6.4-5.4C29.3 36.5 26.8 37 24 37c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.4 40.7 16.1 45 24 45z">
                            </path>
                            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.4 5.4C40.9 36.5 44 30.9 44 24c0-1.2-.1-2.3-.4-3.5z">
                            </path>
                        </svg>
                        Google
                    </button>
                    <p className={classes.register}>
                        Don't have an account?   
                        <a href="#/login" onClick={() => setShowRegister(true)}>
                            <span className={classes.registerLink}>
                                 Create one
                            </span>
                        </a></p>
                </div>
            </div>
        </div>
    )
}

export default Login;