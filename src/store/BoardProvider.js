
import boardContext from "./board-context";
import { useReducer } from "react";
import { TOOLS } from "../constants/toolItem"
// import rough from "roughjs/bin/rough"
import generateRoughEle from "../utils/generateRoughEle"
import getStroke from "perfect-freehand";
import { getSvgPathFromStroke } from "../utils/generateRoughEle"


// const gen = rough.generator();

const boardReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_TOOL": {
            return {
                ...state,
                activeToolItem: action.payload.tool
            }
        }
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

                const { clientX, clientY, stroke, fill, size } = action.payload;
                // const newElement = {
                //     x1: clientX,
                //     y1: clientY,
                //     x2: clientX,
                //     y2: clientY,
                //     roughElement: gen.line(clientX, clientY, clientX, clientY),
                // }
                const newElement = generateRoughEle(state.elements.length, clientX, clientY, clientX, clientY, state.activeToolItem, stroke, fill, size);
                return {
                    ...state,
                    elements: [...state.elements, newElement]
                }
                // }
            }
        case 'DRAW_MOVE':
            {
                // if (state.elements.length === 0) return state;

                const { clientX, clientY, stroke, fill, size } = action.payload;
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
                    return {
                        ...state,
                        elements: updatedElements
                    }
                }
                else {

                    const updatedElement = generateRoughEle(idx, x1, y1, clientX, clientY, state.activeToolItem, stroke, fill, size);
                    updatedElements[idx] = updatedElement;
                    return {
                        ...state,
                        elements: updatedElements
                    }
                }
            }
        default:
            return state;
    }
}

const initialBoardState = {
    activeToolItem: TOOLS.LINE,
    elements: [],
}

function BoardProvider({ children }) {
    const [boardState, dispatchBoardState] = useReducer(boardReducer, initialBoardState);

    // const [activeToolItem, setActiveToolItem] = useState(TOOLS.LINE);

    function handleItemToolClick(tool) {
        dispatchBoardState({
            type: 'CHANGE_TOOL',
            payload: {
                tool,
            }
        })
    }

    function boardMouseDownHandler(event, stroke, fill, size) {
        const clientX = event.clientX;
        const clientY = event.clientY;
        const tool = boardState.activeToolItem;
        console.log(tool);
        dispatchBoardState({
            type: 'DRAW_DOWN',
            payload: {
                tool,
                clientX,
                clientY,
                stroke,
                fill,
                size,
            }
        })
    }

    function boardMouseMoveHandler(event, stroke, fill, size) {
        const { clientX, clientY } = event;
        const tool = boardState.activeToolItem;
        console.log(`in mouse move ${tool}`);
        dispatchBoardState({
            type: 'DRAW_MOVE',
            payload: {
                tool,
                clientX,
                clientY,
                stroke,
                fill,
                size,
            }
        })
    }

    const boardContextValues = {
        activeToolItem: boardState.activeToolItem,
        elements: boardState.elements,
        handleItemToolClick,
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