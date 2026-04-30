
import boardContext from "./board-context";
import {useState} from "react";
import {TOOLS} from "../constants/toolItem"

function BoardProvider({children}){

    const [activeToolItem, setActiveToolItem] = useState(TOOLS.LINE);

    function handleItemToolClick(tool){
        setActiveToolItem(tool)
    }

    const boardContextValues = {
        activeToolItem,
        handleItemToolClick
    }

    return (
        <boardContext.Provider value={boardContextValues}>
            {children}
        </boardContext.Provider>
    )
}

export default BoardProvider;