
import React from "react";
import classes from "./index.module.css";
// import styles from "./index.module.css"

function ToolBar(){
    return (
        <div className={classes.container}>
            <div className={classes.toolItem}>A</div>
            <div className={classes.toolItem}>B</div>
        </div>
    )
}

export default ToolBar;