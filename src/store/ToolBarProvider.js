
import toolBarContext from "./toolBar-context";
import {TOOLS} from "../constants/toolItem";
import {useState} from 'react';

function ToolBarProvider({children}){
    const [activeToolItem, setTool] = useState(TOOLS.BRUSH);

    const handleItemToolClick = (tool)=>{
        setTool(tool);
    };

    const toolBarContextValues = {
        activeToolItem,
        handleItemToolClick,
    }
    return (
        <toolBarContext.Provider value={toolBarContextValues}>
            {children}
        </toolBarContext.Provider>
    )

}


export default ToolBarProvider;