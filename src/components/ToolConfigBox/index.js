
import classes from "./index.module.css";
import toolConfigContext from "../../store/toolConfig-context";
import toolBarContext from "../../store/toolBar-context";
import { COLORS, STROKE_TOOL_TYPE, FILL_TOOL_TYPE,SIZE_TOOL_TYPE, TOOLS } from "../../constants/toolItem"
import { useContext } from "react";
import {TOOL_CONFIG_BOX} from "../../constants/toolItem"

function ToolConfigBox() {
    const { toolConfigState, changeStrokeColorHandler, changeFillColorHandler, changeSizeHandler } = useContext(toolConfigContext);
    const { activeToolItem } = useContext(toolBarContext);


    const strokeColor = toolConfigState[activeToolItem]?.color;
    const fillColor = toolConfigState[activeToolItem]?.fill;
    const size = toolConfigState[activeToolItem]?.stroke;
    return (
        <>
        {TOOL_CONFIG_BOX.includes(activeToolItem) && <div className={classes.toolConfigBox}>

            {/* show stroke color picker */}

            {STROKE_TOOL_TYPE.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.label}>
                    Stroke Color
                </div>
                <div className={classes.colorsContainer}>
                    <div>
                        <input 
                        className={classes.colorPicker}
                        type="color"
                        value={strokeColor}
                        onChange={(e)=>changeStrokeColorHandler(e.target.value)}
                        >

                        </input>
                    </div>
                    {Object.keys(COLORS).map((k) => {
                        return (
                            <div
                            key={k}
                                className={`${classes.colorsBox} ${strokeColor === COLORS[k] && classes.active}`}
                                style={{ backgroundColor: COLORS[k] }}
                                onClick={() => changeStrokeColorHandler(COLORS[k])}
                            >

                            </div>
                        )
                    })}
                </div>
            </div>}

            {/* show fill color picker */}

            {FILL_TOOL_TYPE.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.label}>
                    Fill
                </div>
                <div className={classes.colorsContainer}>
                    {fillColor===null? <div className={`${classes.noFill} ${classes.colorPicker}`}
                        onClick={()=>changeFillColorHandler(null)}>
                        
                    </div>:<div>
                        <input 
                        className={classes.colorPicker}
                        type="color"
                        value={fillColor}
                        onChange={(e)=>changeFillColorHandler(e.target.value)}
                        >
                        </input>
                    </div>}
                    

                     <div className={classes.noFill}
                        onClick={()=>changeFillColorHandler(null)}>
                        
                    </div>
                    {Object.keys(COLORS).map((k) => {
                        return (
                            <div
                            key={k}
                                className={`${classes.colorsBox} ${fillColor === COLORS[k] && classes.active}`}
                                style={{ backgroundColor: COLORS[k] }}
                                onClick={() => changeFillColorHandler(COLORS[k])}
                            >

                            </div>
                        )
                    })}
                </div>
            </div>}
            {SIZE_TOOL_TYPE.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.label}>
                    {activeToolItem===TOOLS.TEXT? "Font Size":"Brush Size"}
                </div>  
                <input type='range' min={activeToolItem===TOOLS.TEXT?12:1} max={activeToolItem===TOOLS.TEXT?64:10} step={1} value={size} 
                  onChange = {(event)=>changeSizeHandler(event.target.value)}
                />
            </div>}
        </div>
        }</>
    )
}


export default ToolConfigBox;