import toolConfigContext from "./toolConfig-context";
import {useReducer} from "react";
import {TOOLS} from "../constants/toolItem";
import {COLORS} from "../constants/toolItem"
const toolConfigReducer = (state,action) => {
    // switch(action.type){
    //     case 
    // }
};

const initialToolConfigState = {
    [TOOLS.LINE]:{
        color:COLORS.BLACK,
        stroke:1,
    },
    [TOOLS.RECTANGLE]:{
        color:COLORS.BLACK,
        stroke:1,
        fill:null
    },
    [TOOLS.CIRCLE]:{
        color:COLORS.BLACK,
        stroke:1,
        fill:null,
    },
    [TOOLS.ARROW_RIGHT]:{
        color:COLORS.BLACK,
        stroke:1,
    }
};

function ToolConfigProvider({children}){
    const [toolConfigState, dispatchToolConfigState] = useReducer(toolConfigReducer, initialToolConfigState);

    const toolConfigContextValues = {
        toolConfigState,
    }
    return(
        <toolConfigContext.Provider value={toolConfigContextValues}>
            {children}
        </toolConfigContext.Provider>
    )
}


export default ToolConfigProvider;