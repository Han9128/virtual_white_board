import {createContext} from "react"



const toolConfigContext = createContext({
    toolConfigState: {},
    changeStrokeHandler: ()=>{},
    changeFillHanlder: ()=>{},
})

export default toolConfigContext;