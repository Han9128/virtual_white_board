
import React from "react";
import classes from "./index.module.css"

function Canvas({canvas}){

    return(
        <div className={classes.canvasContainer}>
            <div className={classes.canvasCard}>
                <h4>{canvas.owner.name}</h4>
            </div>
        </div>
    )
}

export default Canvas;