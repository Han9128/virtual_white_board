
import React, { useState, useContext } from "react";
import classes from './index.module.css';
import authContext from "../../store/auth-context"

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("")
    const { register } = useContext(authContext)


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
            </div>
        </div>
    )
}

export default Register;