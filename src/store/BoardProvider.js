
import boardContext from "./board-context";
import { useReducer, useContext } from "react";
import { TOOLS } from "../constants/toolItem"
// import rough from "roughjs/bin/rough"
import generateRoughEle from "../utils/generateRoughEle"
import getStroke from "perfect-freehand";
import { getSvgPathFromStroke, isNearPointElement} from "../utils/generateRoughEle"
import toolBarContext from "./toolBar-context";


// const gen = rough.generator();

const boardReducer = (state, action) => {
    switch (action.type) {
        // case "CHANGE_TOOL": {
        //     return {
        //         ...state,
        //         activeToolItem: action.payload.tool
        //     }
        // }
        case 'DRAW_DOWN':
            {
                // if(action.payload.tool === TOOLS.BRUSH){
                //     const { clientX, clientY,stroke} = action.payload;
                //     const brushElement = generateRoughEle(state.elements.length,clientX,clientY, state.activeToolItem,stroke);
                //     return {
                //         ...state,
                //         elements:[...state.elements, brushElement]
                //     }
                // }else{

                const { clientX, clientY, stroke, fill, size,tool } = action.payload;
                // const newElement = {
                //     x1: clientX,
                //     y1: clientY,
                //     x2: clientX,
                //     y2: clientY,
                //     roughElement: gen.line(clientX, clientY, clientX, clientY),
                // }
                const newElement = generateRoughEle(state.elements.length, clientX, clientY, clientX, clientY, tool, stroke, fill, size);
                // console.log(`in reducer ${newElement}`);
                return {
                    ...state,
                    elements: [...state.elements, newElement]
                }
                // }
            }
        case 'DRAW_MOVE':
            {
                // if (state.elements.length === 0) return state;

                const { clientX, clientY, stroke, fill, size,tool } = action.payload;
                // copying this way does shallow copy the objects inside array still points to original object
                const updatedElements = [...state.elements]
                // const updatedElements = structuredClone(state.elements);
                const idx = state.elements.length - 1;
                // updatedElements[idx].x2 = clientX;
                // updatedElements[idx].y2 = clientY;
                const { x1, y1 } = updatedElements[idx];

                // updatedElements[idx].roughElement = gen.line(updatedElements[idx].x1, updatedElements[idx].y1, clientX, clientY);
                // const updatedElement = {
                //     ...state.elements[idx],
                //     x2: clientX,
                //     y2: clientY,
                //     roughElement: gen.line(state.elements[idx].x1, state.elements[idx].y1, clientX, clientY)
                // };
                // const updatedElements = [...state.elements];
                // updatedElements[idx] = updatedElement;
                // console.log(updatedElements);
                if (action.payload.tool === TOOLS.BRUSH) {
                    updatedElements[idx].points = [...updatedElements[idx].points, { x: clientX, y: clientY }];
                    updatedElements[idx].path = new Path2D(getSvgPathFromStroke(getStroke(updatedElements[idx].points)));
                    // console.log(updatedElements);
                    return {
                        ...state,
                        elements: updatedElements
                    }
                }
                else {

                    const updatedElement = generateRoughEle(idx, x1, y1, clientX, clientY, tool, stroke, fill, size);
                    updatedElements[idx] = updatedElement;
                    return {
                        ...state,
                        elements: updatedElements
                    }
                }
            }
        case 'ERASE':
            {
                const { clientX, clientY,tool } = action.payload;
                const newElements = state.elements.filter((element)=>{
                    return !isNearPointElement(element,clientX,clientY,tool);
                })
                // console.log(newElements);
                return {
                    ...state,
                    elements:newElements,
                }
            }
        case 'WRITE':
            {
                const {clientX,clientY,color,stroke,fill, tool} = action.payload;
                const newElement = generateRoughEle(state.elements.length,clientX,clientY,clientX,clientY,tool,color,fill,stroke);
                console.log(`newElement: ${newElement.y1}`)
                return {
                    ...state,
                    elements: [...state.elements, newElement],
                }
            }
        default:
            return state;
    }
}

const initialBoardState = {
    elements: [],
}

function BoardProvider({ children }) {
    const [boardState, dispatchBoardState] = useReducer(boardReducer, initialBoardState);
    const { activeToolItem } = useContext(toolBarContext);


    // const [activeToolItem, setActiveToolItem] = useState(TOOLS.LINE);

    // function handleItemToolClick(tool) {
    //     console.log(tool);
    //     dispatchBoardState({
    //         type: 'CHANGE_TOOL',
    //         payload: {
    //             tool,
    //         }
    //     })
    // }

    function boardMouseDownHandler(event, toolConfigState, isWriting) {
        if(isWriting.current) return;
        isWriting.current=true;
        const clientX = event.clientX;
        const clientY = event.clientY;
        const tool = activeToolItem;
        // console.log(tool);
        // console.log(TOOLS.ERASER);
        if(tool === TOOLS.ERASER){
            // console.log("if part");
            dispatchBoardState({
                type:'ERASE',
                payload:{
                    tool, 
                    clientX,
                    clientY,
                }
            })
        }else if(tool===TOOLS.TEXT){
        //     if(isWriting.current) return;
        // isWriting.current=true;
             dispatchBoardState({
                type: 'WRITE',
                payload: {
                    tool,
                    clientX,
                    clientY,
                    stroke: toolConfigState[activeToolItem].color,
                    fill: toolConfigState[activeToolItem].fill,
                    size: toolConfigState[activeToolItem].stroke,
                }
            })
        }
        else{
            // console.log("else part");
            
            dispatchBoardState({
                type: 'DRAW_DOWN',
                payload: {
                    tool,
                    clientX,
                    clientY,
                    stroke: toolConfigState[activeToolItem].color,
                    fill: toolConfigState[activeToolItem].fill,
                    size: toolConfigState[activeToolItem].stroke,
                }
            })
        }
    }

    function boardMouseMoveHandler(event, toolConfigState) {
        const { clientX, clientY } = event;
        const tool = activeToolItem;
        if(tool===TOOLS.TEXT) return;
        // console.log(`in mouse move ${tool}`);
        if(tool === TOOLS.ERASER){
            // console.log("if part");
            dispatchBoardState({
                type:'ERASE',
                payload:{
                    tool, 
                    clientX,
                    clientY,
                }
            })

            return;
        }
        dispatchBoardState({
            type: 'DRAW_MOVE',
            payload: {
                tool,
                clientX,
                clientY,
                stroke: toolConfigState[activeToolItem].color,
                fill: toolConfigState[activeToolItem].fill,
                size: toolConfigState[activeToolItem].stroke,
            }
        })
    }

    const boardContextValues = {
        elements: boardState.elements,
        boardMouseDownHandler,
        boardMouseMoveHandler,
    }

    return (
        <boardContext.Provider value={boardContextValues}>
            {children}
        </boardContext.Provider>
    )
}

export default BoardProvider;