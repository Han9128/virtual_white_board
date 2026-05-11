import {createContext} from "react";

const boardContext = createContext({
    elements:[],
    handleItemToolClick: ()=>{},
    boardMouseDownHandler: ()=>{},
    boardMouseMoveHandler: ()=>{},
    undoHandler: ()=>{},
    redoHandler:()=>{},
})

export default boardContext;