
import React, { useState } from "react";
import classes from "./index.module.css";
// import styles from "./index.module.css"

import { LuRectangleHorizontal } from "react-icons/lu";
import { FaSlash, FaRegCircle, FaEraser, FaArrowRight, FaPaintBrush, FaDownload, FaFont, FaUndo, FaRedo } from "react-icons/fa";

function ToolBar() {
    const [activeTool, setActiveTool] = useState("LINE");
    return (
        <div className={classes.container}>
            <div className={`${classes.toolItem} ${activeTool === "LINE" ? classes.active : ""}`} onClick={() => setActiveTool("LINE")}><FaSlash /></div>
            <div className={`${classes.toolItem} ${activeTool === "RECTANGLE" ? classes.active : ""}`} onClick={() => setActiveTool("RECTANGLE")}><LuRectangleHorizontal /></div>
        </div>
    )
}

export default ToolBar;