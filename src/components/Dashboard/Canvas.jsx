
import React, { useState, useRef} from "react";
import classes from "./index.module.css";
import { Share2,Trash } from "lucide-react";
import loginClasses from "../Login/index.module.css"
import { deleteCanvas, loadCanvas, shareCanvas } from "../../services/canvasApi"

function Canvas({ canvas, token, onDelete, onLoad }) {

    const [askEmail, setAskEmail] = useState(false);
    const [email, setEmail] = useState("");
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
            console.error(err.message);
        }
    }

    const handleCardClick = async (id) => {
        try {
            console.log("card is clicked")
            const data = await loadCanvas(token, id);
            console.log(data.canvas.elements);
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
            const data = await shareCanvas(token,id, payload);
            setAskEmail(false);
            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        askEmail ?
             <div className={loginClasses.loginBackground} >
            <div className={loginClasses.loginContainer}>
                <form onSubmit={handleShare}>
                    <div className={loginClasses.loginFieldBox}>
                        <div>
                            <label htmlFor="email">email:</label>
                            <br></br>
                            <input
                                type="email"
                                name="email"
                                id="userName"
                                className={`${loginClasses.username} ${loginClasses.loginInput}`}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <br />
                    </div>
                    <button type="submit" className={loginClasses.loginBtn}>Share</button>
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
                        onClick={(e) => {e.stopPropagation();handleDelete(canvas._id, canvas.elements)}}
                    ><Trash size={16}/>
                    </button>
                    </div>
                    <div className={classes.canvasMeta}>
                        Edited <span className={classes.editDuration}><b>{findEditDuration()}</b></span> ago
                    </div>
                </div>
            </div >

    )
}

export default Canvas;