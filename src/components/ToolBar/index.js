
import React, { useContext } from "react";
import classes from "./index.module.css";
import {TOOL_ITEMS} from "../../constants/toolItem"
import boardContext from "../../store/board-context"
// import styles from "./index.module.css"



function ToolBar() {
    const { activeToolItem, handleItemToolClick } = useContext(boardContext);
    return (
        <div className={classes.container}>
            {TOOL_ITEMS.map((tool) => {
                const Icon = tool.icon
                return (
                <div 
                key={tool.id}
                className={`${classes.toolItem} ${activeToolItem === tool.id ? classes.active : ""}`}
                 onClick={() => handleItemToolClick(tool.id)}>
                    <Icon/>
                 </div>)
            })}
        </div>
    )
}

export default ToolBar;