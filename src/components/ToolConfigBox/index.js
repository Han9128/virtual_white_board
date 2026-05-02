
import classes from "./index.module.css";
import toolConfigContext from "../../store/toolConfig-context";
import boardContext from "../../store/board-context";
import {COLORS} from "../../constants/toolItem"
import {useContext} from "react";

function ToolConfigBox(){
    const {toolConfigState} = useContext(toolConfigContext);
    const {activeToolItem} = useContext(boardContext);
    console.log(activeToolItem);
    return (
        <div className={classes.toolConfigBox}>
            <div className={classes.selectOptionContainer}>
                <div className={classes.label}>
                    Stroke
                </div>
                <div className={classes.colorsContainer}>
                    {Object.keys(COLORS).map((k)=>{
                        return(
                            <div className={classes.colorsBox} style={{backgroundColor:COLORS[k]}}></div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


export default ToolConfigBox;