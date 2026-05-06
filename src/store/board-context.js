import {createContext} from "react";

const boardContext = createContext({
    elements:[],
    handleItemToolClick: ()=>{},
    boardMouseDownHandler: ()=>{},
    boardMouseMoveHandler: ()=>{},
})

export default boardContext;