
import classes from "./index.module.css";
import toolConfigContext from "../../store/toolConfig-context";
import toolBarContext from "../../store/toolBar-context";
import { COLORS, STROKE_TOOL_TYPE, FILL_TOOL_TYPE,SIZE_TOOL_TYPE } from "../../constants/toolItem"
import { useContext } from "react";
import {TOOL_CONFIG_BOX} from "../../constants/toolItem"

function ToolConfigBox() {
    const { toolConfigState, changeStrokeColorHandler, changeFillColorHandler, changeSizeHandler } = useContext(toolConfigContext);
    const { activeToolItem } = useContext(toolBarContext);


    const strokeColor = toolConfigState[activeToolItem]?.color;
    const fillColor = toolConfigState[activeToolItem]?.fill;
    const size = toolConfigState[activeToolItem]?.stroke;
    // console.log(activeToolItem);
    // console.log(strokeColor);
    return (
        <>
        {TOOL_CONFIG_BOX.includes(activeToolItem) && <div className={classes.toolConfigBox}>

            {/* show stroke color picker */}

            {STROKE_TOOL_TYPE.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.label}>
                    Stroke
                </div>
                <div className={classes.colorsContainer}>
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
                    Brush Size
                </div>  
                <input type='range' min='0' max='10' step={1} value={size} 
                  onChange = {(event)=>changeSizeHandler(event.target.value)}
                />
                {/* <div className={classes.colorsContainer}>
                    {Object.keys(COLORS).map((k) => {
                        return (
                            <div
                                className={`${classes.colorsBox} ${fillColor === COLORS[k] && classes.active}`}
                                style={{ backgroundColor: COLORS[k] }}
                                onClick={() => changeFillColorHandler(COLORS[k])}
                            >

                            </div>
                        )
                    })}
                </div> */}
            </div>}
        </div>
        }</>
    )
}


export default ToolConfigBox;