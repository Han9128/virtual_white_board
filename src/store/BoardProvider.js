
import boardContext from "./board-context";
import { useReducer, useState, useContext,useCallback } from "react";
import { TOOLS,BOARD_ACTIONS } from "../constants/constants"
import generateRoughEle from "../utils/generateRoughEle"
import getStroke from "perfect-freehand";
import { getSvgPathFromStroke, isNearPointElement } from "../utils/generateRoughEle"
import toolBarContext from "./toolBar-context";



const boardReducer = (state, action) => {
    switch (action.type) {
        case BOARD_ACTIONS.DRAW_DOWN:
            {

                const { clientX, clientY, stroke, fill, size, tool } = action.payload;

                const newElement = generateRoughEle(state.elements.length, clientX, clientY, clientX, clientY, tool, stroke, fill, size);
                return {
                    ...state,
                    elements: [...state.elements, newElement]
                }
                // }
            }
        case BOARD_ACTIONS.DRAW_MOVE:
            {


                const { clientX, clientY, stroke, fill, size, tool } = action.payload;
                // copying this way does shallow copy the objects inside array still points to original object
                const updatedElements = [...state.elements]
                const idx = state.elements.length - 1;
                const { x1, y1 } = updatedElements[idx];

                if (action.payload.tool === TOOLS.BRUSH) {
                    if (updatedElements[idx].points) {
                        updatedElements[idx].points = [...updatedElements[idx].points, { x: clientX, y: clientY }];
                        updatedElements[idx].path = new Path2D(getSvgPathFromStroke(getStroke(updatedElements[idx].points)));
                    }
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

        case BOARD_ACTIONS.MOUSE_UP:
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
        case BOARD_ACTIONS.ERASE:
            {
                const { clientX, clientY, tool } = action.payload;

                const newElements = state.elements.filter((element) => {
                    if (isNearPointElement(element, clientX, clientY, tool)) {

                        return false;
                    }

                    return true;
                })
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
                    history:somethingErased?newHistory:state.history,
                    index:newIndex,

                }
            }
        case BOARD_ACTIONS.WRITE:
            {
                const { clientX, clientY, stroke, fill, size, tool } = action.payload;
                const newElement = generateRoughEle(state.elements.length, clientX, clientY, clientX, clientY, tool, stroke, fill, size);
                return {
                    ...state,
                    elements: [...state.elements, newElement],
                }
            }

        case BOARD_ACTIONS.CHANGE_TEXT:
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

        case BOARD_ACTIONS.UNDO:
            {
                if (state.index <= 0) return state;
                return {
                    ...state,
                    elements: state.history[state.index - 1],
                    index: state.index - 1,
                }
            }

        case BOARD_ACTIONS.REDO:
            {
                if (state.index >= state.history.length - 1) return state;
                return {
                    ...state,
                    elements: state.history[state.index + 1],
                    index: state.index + 1,
                }
            }
        case BOARD_ACTIONS.LOAD_CANVAS:
            {
                console.log("reducer payload", action.payload.elements)
                return {
                    ...state,
                    elements:action.payload.elements,
                    history:[action.payload.elements],
                    index:0
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
    const [canvasId, setCanvasId] = useState(null)
    const { activeToolItem } = useContext(toolBarContext);



    function boardMouseDownHandler(event, toolConfigState, isWriting) {
        if(isWriting) return;
        const clientX = event.clientX;
        const clientY = event.clientY;
        const tool = activeToolItem;

        if (tool === TOOLS.UNDO || tool === TOOLS.REDO || tool === TOOLS.DOWNLOAD) return;
        if (tool === TOOLS.ERASER) {
            dispatchBoardState({
                type: BOARD_ACTIONS.ERASE,
                payload: {
                    tool,
                    clientX,
                    clientY,
                }
            })
        } else if (tool === TOOLS.TEXT) {
            console.log("inside text")
            dispatchBoardState({
                type: BOARD_ACTIONS.WRITE,
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

            dispatchBoardState({
                type: BOARD_ACTIONS.DRAW_DOWN,
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
        if (tool === TOOLS.ERASER) {
            dispatchBoardState({
                type: BOARD_ACTIONS.ERASE,
                payload: {
                    tool,
                    clientX,
                    clientY,
                }
            })

            return;
        }

        dispatchBoardState({
            type: BOARD_ACTIONS.DRAW_MOVE,
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
            type: BOARD_ACTIONS.MOUSE_UP,
            payload:{
                tool:activeToolItem,
            }
        })
    }

    function textAreaBlurHandler(value) {
        dispatchBoardState({
            type: BOARD_ACTIONS.CHANGE_TEXT,
            payload: {
                text: value,
            }
        })
        boardMouseUpHandler();
    }

   const undoHandler = useCallback(function () {
        dispatchBoardState({
            type: BOARD_ACTIONS.UNDO,
        })
    },[])

   const redoHandler = useCallback(function () {
        dispatchBoardState({
            type: BOARD_ACTIONS.REDO,
        })
    },[]);

    function downloadHandler() {
        const canvas = document.getElementById('canvas');
        const data = canvas.toDataURL("image/png");
        const anchor = document.createElement("a");
        anchor.href = data;
        anchor.download = "board.png";
        anchor.click();
    }

    const loadCanvasHandler = (elements) => {
        dispatchBoardState({
            type:BOARD_ACTIONS.LOAD_CANVAS,
            payload:{
                elements
            }
        })
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
        canvasId,
        setCanvasId,
        loadCanvasHandler
    }

    return (
        <boardContext.Provider value={boardContextValues}>
            {children}
        </boardContext.Provider>
    )
}

export default BoardProvider;