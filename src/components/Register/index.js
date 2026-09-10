
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
    const { register,setIsLogin } = useContext(authContext)


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
                        <h1>Create your account</h1>
                        <p>It only takes a minute to gest started.</p>
                    </div>
                
                <form className={classes.registerForm} onSubmit={handleSubmit}>
                    <div>
                        <div className={`${classes.registerField} ${classes.nameField}`}>
                            <label htmlFor="name">Name:</label>
                            <input
                                id="name"
                                required
                                value={name}
                                className={`${classes.nameInput} ${classes.registerInput}`}
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className={`${classes.registerField} ${classes.emailField}`}>
                            <label htmlFor="email">Email:</label>
                            <input
                                value={email}
                                id="email"
                                required
                                className={`${classes.emailInput} ${classes.registerInput}`}
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}

                            />
                        </div>
                        <div className={`${classes.registerField} ${classes.passwordField}`}>
                            <label htmlFor="password">Password:</label>
                            <input
                                id="password"
                                required
                                className={`${classes.passwordInput} ${classes.registerInput}`}
                                type="password" onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                        <div className={`${classes.registerField} ${classes.confirmField}`}>
                            <label htmlFor="confirm">Confirm Password:</label>
                            <input
                                id="confirm"
                                required
                                value={confirmPassword}
                                className={`${classes.confirmInput} ${classes.registerInput}`}
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {passwordError && <p className={classes.passwordError}>{passwordError}</p>}
                        </div>
                    </div>
                    <button type="submit" className={classes.registerBtn}>Register</button>
                </form>
                {/* <p className={classes.register}>
                        Already have an account? 
                        <a href="#/login" onClick={() => setIsLogin(true)}>
                            <span className={classes.registerLink}>
                                Log in
                            </span>
                        </a></p> */}
                </div>
            </div>
        </div>
    )
}

export default Register;