
import React, { useState, useRef} from "react";
import classes from "./index.module.css";
import { Share2,Trash,Mail } from "lucide-react";
import loginClasses from "../Login/index.module.css"
import { deleteCanvas, loadCanvas, shareCanvas } from "../../services/canvasApi";

function Canvas({ canvas, token, onDelete, onLoad }) {

    const [askEmail, setAskEmail] = useState(false);
    const [email, setEmail] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const canvasId = useRef(null);
    const findEditDuration = () => {
        let seconds = (new Date() - new Date(canvas.modifiedAt)) / 1000;
        const day = Math.floor(seconds / (3600 * 24));
        seconds = seconds % (3600 * 24);
        const hour = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        const minute = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        if (day > 0) {
            return `${day}d`;
        } else if (hour > 0) {
            return `${hour}h`
        } else if (minute > 0) {
            return `${minute}m`
        }

        return `${seconds}s`
    }

    const handleDelete = async (id) => {
        try {
            const data = await deleteCanvas(token, id);
            onDelete(id);
            return data;
        } catch (err) {
            setDeleteError(err.message);
            console.error(err.message);
        }
    }

    const handleCardClick = async (id) => {
        try {
            const data = await loadCanvas(token, id);
            onLoad(id, data.canvas.elements);
            return data;
        } catch (err) {
            console.errror(err.message);
        }
    }


    const handleShare = async (e) => {
        e.preventDefault();
        const id = canvasId.current;
        try {
            const payload = {
                email: email
            }
            const res = await shareCanvas(token,id, payload);
            if(res.status === 404){
                setFieldError(res.message);
                return;
            }
            if(res.status === 403){
                setFieldError(res.message);
                return;
            }

            if(res.status === 400){
                setFieldError(res.message);
                return;
            }
            setAskEmail(false);
            return res;
        } catch (err) {
            setFieldError("Something went wrong. Please try again")
            console.error(err.message);
        }
    }

    return (
        askEmail ?
             <div className={classes.shareBackground} >
            <div className={classes.shareContainer}>
                <form onSubmit={handleShare}>
                    <div className={classes.shareFieldBox}>
                       <div className={loginClasses.field}>
                                <label htmlFor="email">Email:</label>
                                <div className={loginClasses.inputWrap}>
                                    <Mail className={loginClasses.inputIcon}/>
                                    <input
                                        type="email"
                                        name="email"
                                        id="userName"
                                        className={loginClasses.loginInput}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {fieldError && <div className={loginClasses.fieldError}> {fieldError}</div>}
                            </div>
                    </div>
                    <button type="submit" className={classes.shareBtn}>Share</button>
                </form>
            </div>
        </div> :
            <div className={classes.canvasCard} >
                <div className={classes.topPart} onClick={() => handleCardClick(canvas._id)}>
                    <p  className={classes.share} onClick={(e) => {e.stopPropagation();canvasId.current=canvas._id;setAskEmail(true);}}><Share2 size={13}/> Share</p>
                </div>
                <div className={classes.bottomPart}>
                    <div className={classes.canvasInfo}>
                        <h3 className={classes.canvasName}>{canvas.name || 'Canvas'}</h3>
                    <button
                        className={classes.deleteCanvas}
                        style={deleteError ? {display:'none'}:{}}
                        onClick={(e) => {e.stopPropagation();handleDelete(canvas._id, canvas.elements)}}
                    ><Trash size={16}/>
                    </button>
                    {deleteError && <p className={classes.deleteError}>{deleteError}</p>}
                    </div>
                    <div className={classes.canvasMeta}>
                        Edited <span className={classes.editDuration}><b>{findEditDuration()}</b></span> ago
                    </div>
                </div>
            </div >

    )
}

export default Canvas;