
import React, { useContext } from "react";
import classes from "./index.module.css";
import {TOOL_ITEMS, FEATURES, TOOLS} from "../../constants/constants"
import toolBarContext from "../../store/toolBar-context";
import boardContext from "../../store/board-context"




function ToolBar() {
    const { activeToolItem, handleItemToolClick } = useContext(toolBarContext);
    const {undoHandler,redoHandler, downloadHandler} = useContext(boardContext);

    function handleClick(feat){
        // handleItemToolClick(feat)
        switch(feat){
            case TOOLS.UNDO:
                {
                    undoHandler();
                    break;
                }
            
            case TOOLS.REDO:
                {
                    redoHandler();
                    break;
                }
            
            case TOOLS.DOWNLOAD:{
                downloadHandler();
                break;
            }
            
            default:
                throw new Error(`${feat} not recognized`)

        }
    }
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
            {FEATURES.map((feat) => {
                const Icon = feat.icon
                return (
                <div 
                key={feat.id}
                className={`${classes.toolItem}`}
                 onClick={() => handleClick(feat.id)}>
                    <Icon/>
                 </div>)
            })}
        </div>
    )
}

export default ToolBar;