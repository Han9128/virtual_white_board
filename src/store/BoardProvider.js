
import boardContext from "./board-context";
import { useReducer, useContext } from "react";
import { TOOLS } from "../constants/toolItem"
// import rough from "roughjs/bin/rough"
import generateRoughEle from "../utils/generateRoughEle"
import getStroke from "perfect-freehand";
import { getSvgPathFromStroke, isNearPointElement } from "../utils/generateRoughEle"
import toolBarContext from "./toolBar-context";


// const gen = rough.generator();

const boardReducer = (state, action) => {
    switch (action.type) {
        case 'DRAW_DOWN':
            {

                const { clientX, clientY, stroke, fill, size, tool } = action.payload;

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


                const { clientX, clientY, stroke, fill, size, tool } = action.payload;
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
                    // console.log('mouse move fired');
                    // console.log(updatedElements[idx].points);
                    if (updatedElements[idx].points) {
                        updatedElements[idx].points = [...updatedElements[idx].points, { x: clientX, y: clientY }];
                        updatedElements[idx].path = new Path2D(getSvgPathFromStroke(getStroke(updatedElements[idx].points)));
                    }
                    // console.log(updatedElements);
                    return {
                        ...state,
                        elements: updatedElements,
                    }
                }
                else {

                    const updatedElement = generateRoughEle(idx, x1, y1, clientX, clientY, tool, stroke, fill, size);
                    updatedElements[idx] = updatedElement;

                    return {
                        ...state,
                        elements: updatedElements,
                    }
                }
            }

        case 'MOUSE_UP':
            {
                if(action.payload.tool===TOOLS.ERASER) return state;
                const elementsCopy = [...state.elements];
                const newHistory = state.history.slice(0, state.index + 1);
                newHistory.push(elementsCopy);
                return {
                    ...state,
                    history: newHistory,
                    index: state.index + 1,
                }
            }
        case 'ERASE':
            {
                const { clientX, clientY, tool } = action.payload;

                const newElements = state.elements.filter((element) => {
                    if (isNearPointElement(element, clientX, clientY, tool)) {

                        return false;
                    }

                    return true;
                })
                // console.log(newElements);
                const newHistory = state.history.slice(0, state.index + 1);
                let newIndex = state.index;
                const somethingErased = newElements.length < state.elements.length;
                if (somethingErased) {
                    newHistory.push(newElements);
                    newIndex += 1;
                }
                return {
                    ...state,
                    elements: newElements,
                    history:newHistory,
                    index:newIndex,

                }
            }
        case 'WRITE':
            {
                const { clientX, clientY, stroke, fill, size, tool } = action.payload;
                const newElement = generateRoughEle(state.elements.length, clientX, clientY, clientX, clientY, tool, stroke, fill, size);
                // console.log(`newElement: ${newElement.stroke}`)
                return {
                    ...state,
                    elements: [...state.elements, newElement],
                }
            }

        case 'CHANGE_TEXT':
            {
                const { text } = action.payload;
                const idx = state.elements.length - 1;
                const updatedElements = [...state.elements];
                updatedElements[idx].text = text;

                return {
                    ...state,
                    elements: updatedElements,
                }
            }

        case 'UNDO':
            {
                if (state.index <= 0) return state;
                return {
                    ...state,
                    elements: state.history[state.index - 1],
                    index: state.index - 1,
                }
            }

        case 'REDO':
            {
                if (state.index >= state.history.length - 1) return state;
                return {
                    ...state,
                    elements: state.history[state.index + 1],
                    index: state.index + 1,
                }
            }
        default:
            return state;
    }
}

const initialBoardState = {
    elements: [],
    history: [[]],
    index: 0,
}

function BoardProvider({ children }) {
    const [boardState, dispatchBoardState] = useReducer(boardReducer, initialBoardState);
    const { activeToolItem } = useContext(toolBarContext);



    function boardMouseDownHandler(event, toolConfigState, isWriting) {

        if (isWriting) return;
        const clientX = event.clientX;
        const clientY = event.clientY;
        const tool = activeToolItem;

        if (tool === TOOLS.UNDO || tool === TOOLS.REDO || tool === TOOLS.DOWNLOAD) return;

        if (tool === TOOLS.ERASER) {
            // console.log("if part");
            dispatchBoardState({
                type: 'ERASE',
                payload: {
                    tool,
                    clientX,
                    clientY,
                }
            })
        } else if (tool === TOOLS.TEXT) {
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
        else {
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
        if (tool === TOOLS.TEXT || tool === TOOLS.UNDO || tool === TOOLS.REDO || tool === TOOLS.DOWNLOAD) return;
        // console.log(`in mouse move ${tool}`);
        if (tool === TOOLS.ERASER) {
            // console.log("if part");
            dispatchBoardState({
                type: 'ERASE',
                payload: {
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

    function boardMouseUpHandler() {
        dispatchBoardState({
            type: 'MOUSE_UP',
            payload:{
                tool:activeToolItem,
            }
        })
    }

    function textAreaBlurHandler(value) {
        dispatchBoardState({
            type: 'CHANGE_TEXT',
            payload: {
                text: value,
            }
        })
        boardMouseUpHandler();
    }

    function undoHandler() {
        dispatchBoardState({
            type: 'UNDO',
        })
    }
    function redoHandler() {
        dispatchBoardState({
            type: 'REDO',
        })
    }

    function downloadHandler() {
        const canvas = document.getElementById('canvas');
        const data = canvas.toDataURL("image/png");
        const anchor = document.createElement("a");
        anchor.href = data;
        anchor.download = "board.png";
        anchor.click();
    }

    const boardContextValues = {
        elements: boardState.elements,
        history: boardState.history,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        textAreaBlurHandler,
        boardMouseUpHandler,
        undoHandler,
        redoHandler,
        downloadHandler,
    }

    return (
        <boardContext.Provider value={boardContextValues}>
            {children}
        </boardContext.Provider>
    )
}

export default BoardProvider;