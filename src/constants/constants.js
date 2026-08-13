import { LuRectangleHorizontal } from "react-icons/lu";
import { FaSlash, FaRegCircle, FaEraser, FaArrowRight, FaPaintBrush, FaDownload, FaFont, FaUndo, FaRedo } from "react-icons/fa";

export const TOOLS = {
    BRUSH:"brush",
    LINE: "line",
    RECTANGLE:"rectangle",
    CIRCLE: "circle",
    ARROW_RIGHT: "arrow_right",
    TEXT: "font",
    ERASER:"eraser",
    UNDO:"undo",
    REDO:"redo",
    DOWNLOAD:"download",
}


export const TOOL_ITEMS = [
    {
        id:TOOLS.BRUSH,
        icon:FaPaintBrush
    },
    {
        id:TOOLS.LINE,
        icon:FaSlash
    },
    {
        id:TOOLS.RECTANGLE,
        icon:LuRectangleHorizontal
    },
    {
        id:TOOLS.CIRCLE,
        icon:FaRegCircle
    },
    {
        id:TOOLS.ARROW_RIGHT,
        icon:FaArrowRight
    },
    {
        id:TOOLS.TEXT,
        icon:FaFont
    },
    {
        id:TOOLS.ERASER,
        icon:FaEraser
    },
]

export const FEATURES = [
     {
        id:TOOLS.UNDO,
        icon:FaUndo
    },

    {
        id:TOOLS.REDO,
        icon:FaRedo
    },

    {
        id:TOOLS.DOWNLOAD,
        icon:FaDownload
    },
]

export const ARROW_LENGTH = 20;


export const COLORS = {
    BLACK: '#000000',
    RED: '#ff0000',
    GREEN: '#00ff00',
    BLUE: '#0000ff',
    ORANGE: '#ffa500',
    YELLOW: '#ffff00',
    // WHITE: '#ffffff'
}

export const STROKE_TOOL_TYPE = [TOOLS.BRUSH,TOOLS.LINE,TOOLS.RECTANGLE,TOOLS.CIRCLE,TOOLS.ARROW_RIGHT, TOOLS.TEXT];
export const FILL_TOOL_TYPE = [TOOLS.RECTANGLE,TOOLS.CIRCLE];
export const SIZE_TOOL_TYPE = [TOOLS.LINE,TOOLS.RECTANGLE,TOOLS.CIRCLE,TOOLS.ARROW_RIGHT, TOOLS.TEXT];

export const TOOL_CONFIG_BOX = [TOOLS.BRUSH,TOOLS.LINE,TOOLS.RECTANGLE,TOOLS.CIRCLE,TOOLS.ARROW_RIGHT,TOOLS.TEXT];

export const BOARD_ACTIONS = {
    DRAWING: "DRAW",
    ERASING: "ERASE",
    DRAW_DOWN: "DRAW_DOWN",
    DRAW_MOVE: "DRAW_MOVE",
    MOUSE_UP: "MOUSE_UP",
    ERASE: "ERASE",
    WRITE: "WRITE",
    CHANGE_TEXT: "CHANGE_TEXT",
    UNDO:"UNDO",
    REDO: "REDO",
    LOAD_CANVAS:"LOAD_CANVAS"
}



export const ERASE_THRESHOLD = 0.1;


export const BASE_URL = "http://localhost:5000/api"