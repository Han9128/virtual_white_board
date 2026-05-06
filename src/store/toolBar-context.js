
import {createContext} from "react";

const toolBarContext = createContext({
    activeToolItem: "",
    handleItemToolClick: ()=>{},
})

export default toolBarContext;