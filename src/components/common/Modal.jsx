
import classes from "./modal.module.css";
import loginClasses from "../Login/index.module.css";
import { Mail } from "lucide-react";

function Modal({ setActionState, handleAction, setInput, actionStatus, input, fieldMessage, action }) {

    return (
        <div
            className={classes.shareBackground}
            role="dialog"
            aria-modal="true"
            aria-label={action === "Share" ? "Share canvas" : "Delete canvas"}
            onClick={() => setActionState(false)}>
            <div className={classes.shareContainer} onClick={(e) => e.stopPropagation()}>

                <form onSubmit={handleAction} >
                    <div className={classes.shareFieldBox}>

                        <div className={loginClasses.field}>
                            {action === "Share" ?
                                <>
                                    <label htmlFor="email">Email:</label>
                                    <div className={loginClasses.inputWrap}>

                                        <Mail className={loginClasses.inputIcon} />
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className={loginClasses.loginInput}
                                            required
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="you@example.com"
                                            autoFocus
                                        />

                                    </div>

                                </> :
                                <>
                                    <label htmlFor="delete">Type CANVAS to Delete:</label>
                                    <div className={loginClasses.inputWrap} >
                                        <input
                                            type="text"
                                            name="CANVAS"
                                            id="delete"
                                            className={loginClasses.loginInput}
                                            required
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="CANVAS"
                                            autoFocus
                                            style={{ paddingLeft: "12px" }}
                                        />
                                    </div>
                                </>
                            }

                            {fieldMessage && <div className={fieldMessage.ok ? classes.fieldSucces : loginClasses.fieldError} > {fieldMessage.message}</div>}
                        </div>
                    </div>
                    <button type="submit" className={classes.shareBtn} disabled={actionStatus.action === action}>{actionStatus.action ? actionStatus.label : action}</button>
                </form>
            </div>
        </div>
    )
}

export default Modal;



