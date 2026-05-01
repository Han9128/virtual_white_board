import {createContext} from "react";

const boardContext = createContext({
    activeToolItem: "",
    elements:[],
    handleItemToolClick: ()=>{},
    boardMouseDownHandler: ()=>{},
    boardMouseMoveHandler: ()=>{},
})

export default boardContext;