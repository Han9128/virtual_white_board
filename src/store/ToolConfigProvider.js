import toolConfigContext from "./toolConfig-context";
import boardContext from "./board-context"
import { useReducer, useContext } from "react";
import { TOOLS } from "../constants/toolItem";
import { COLORS } from "../constants/toolItem";



const toolConfigReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_STROKE':
            {
                // console.log("its in change_stroke case")
                const newState = {...state};
                newState[action.payload.tool].color = action.payload.strokeColor;
                // console.log(`in reduer ${newState[action.payload.tool].color}`);
                return newState;
            }
        case 'CHANGE_FILL':
            {
                // console.log("its in change_stroke case")
                const newState = {...state};
                newState[action.payload.tool].fill = action.payload.fillColor;
                // console.log(`in reduer ${newState[action.payload.tool].color}`);
                return newState;
            }
        case 'CHANGE_SIZE':
            {
                // console.log("its in change_stroke case")
                const newState = {...state};
                newState[action.payload.tool].stroke = action.payload.size;
                // console.log(`in reduer ${newState[action.payload.tool].color}`);
                return newState;
            }

        default:
            break;
    }
};

const initialToolConfigState = {
    [TOOLS.LINE]: {
        color: COLORS.BLACK,
        stroke: 1,
    },
    [TOOLS.RECTANGLE]: {
        color: COLORS.BLACK,
        stroke: 1,
        fill: null
    },
    [TOOLS.CIRCLE]: {
        color: COLORS.BLACK,
        stroke: 1,
        fill: null,
    },
    [TOOLS.ARROW_RIGHT]: {
        color: COLORS.BLACK,
        stroke: 1,
    }
};

function ToolConfigProvider({ children }) {
    const [toolConfigState, dispatchToolConfigState] = useReducer(toolConfigReducer, initialToolConfigState);

    const { activeToolItem } = useContext(boardContext);

    const changeStrokeColorHandler = (strokeColor) => {
        // console.log("color is clicked");
        const tool = activeToolItem;
        // console.log(`in changeHandler ${strokeColor}`)
        dispatchToolConfigState({
            type: "CHANGE_STROKE",
            payload: {
                tool,
                strokeColor,
            }
        })
    }
    const changeFillColorHandler = (fillColor) => {
        // console.log("color is clicked");
        const tool = activeToolItem;
        // console.log(`in changeHandler ${strokeColor}`)
        dispatchToolConfigState({
            type: "CHANGE_FILL",
            payload: {
                tool,
                fillColor,
            }
        })
    }
    const changeSizeHandler = (size) => {
        // console.log("color is clicked");
        const tool = activeToolItem;
        // console.log(`in changeHandler ${strokeColor}`)
        dispatchToolConfigState({
            type: "CHANGE_SIZE",
            payload: {
                tool,
                size,
            }
        })
    }

    const toolConfigContextValues = {
        toolConfigState,
        changeStrokeColorHandler,
        changeFillColorHandler,
        changeSizeHandler,
    }
    return (
        <toolConfigContext.Provider value={toolConfigContextValues}>
            {children}
        </toolConfigContext.Provider>
    )
}


export default ToolConfigProvider;