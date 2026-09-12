
import React, { useState } from "react";
import authContext from "../../store/auth-context";
import classes from "./index.module.css";
import { Presentation,Mail,Lock } from 'lucide-react';
import {ReactComponent as Google} from "../../assets/icons/google.svg";
import {ReactComponent as Doodle} from "../../assets/icons/doodle.svg";
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