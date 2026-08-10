
import React from "react";
import classes from "./index.module.css";
import {deleteCanvas} from "../../services/canvasApi"

function Canvas({ canvas,token, onDelete }) {

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
        try{
            const data = await deleteCanvas(token,id);
            onDelete(id);
            return data;
        }catch(err){
            console.error(err.message);
        }
    }
    return (
        <div className={classes.canvasCard}>
            <div className={classes.topPart}>

            </div>
            <div className={classes.bottomPart}>
                <div className={classes.canvasInfo}>
                    <h5 className={classes.canvasName}>Canvas</h5>
                    <p>Edited <span className={classes.editDuration}>{findEditDuration()}</span>ago</p>
                </div>
                <button
                    className={classes.deleteCanvas}
                    onClick={() => handleDelete(canvas._id)}
                  >Delete
            </button>
        </div>
        </div >

    )
}

export default Canvas;