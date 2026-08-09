
import React from "react";
import classes from "./index.module.css"

function Canvas({ canvas }) {

    const findEditDuration = () => {
        let seconds = (new Date() - new Date(canvas.modifiedAt))/1000;
        const day = Math.floor(seconds/(3600*24));
        seconds = seconds%(3600*24);
        const hour = Math.floor(seconds/3600);
        seconds = seconds%3600;
        const minute = Math.floor(seconds/60);
        seconds = seconds%60;
        if(day>0){
            return `${day}d`;
        }else if(hour>0){
            return `${hour}h`
        }else if(minute>0){
            return `${minute}m`
        }

        return `${seconds}s`
    }
    return (
        <div className={classes.canvasCard}>
            <div className={classes.topPart}>

            </div>
            <div className={classes.bottomPart}>
                <h5 className={classes.canvasName}>Canvas</h5>
                <p>Edited <span className={classes.editDuration}>{findEditDuration()} </span>ago</p>
            </div>
        </div>

    )
}

export default Canvas;