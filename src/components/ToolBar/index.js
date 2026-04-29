
import React, { useState } from "react";
import classes from "./index.module.css";
import {TOOL_ITEMS} from "../../constants/toolItem"
// import styles from "./index.module.css"



function ToolBar() {
    const [activeTool, setActiveTool] = useState("LINE");
    return (
        <div className={classes.container}>
            {TOOL_ITEMS.map((tool) => {
                const Icon = tool.icon;

                return (
                <div 
                key={tool.id}
                className={`${classes.toolItem} ${activeTool === tool.id ? classes.active : ""}`}
                 onClick={() => setActiveTool(tool.id)}><Icon/>
                 </div>)
            })}
        </div>
    )
}

export default ToolBar;