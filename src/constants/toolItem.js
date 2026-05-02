import { LuRectangleHorizontal } from "react-icons/lu";
import { FaSlash, FaRegCircle, FaEraser, FaArrowRight, FaPaintBrush, FaDownload, FaFont, FaUndo, FaRedo } from "react-icons/fa";

export const TOOLS = {
    BRUSH:"brush",
    LINE: "line",
    RECTANGLE:"rectangle",
    CIRCLE: "circle",
    ARROW_RIGHT: "arrow_right",
    FONT: "font",
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
        id:TOOLS.FONT,
        icon:FaFont
    },
    {
        id:TOOLS.ERASER,
        icon:FaEraser
    },

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
    BLUE: '0000ff',
    ORANGE: '#ffa500',
    YELLOW: '#ffff00',
    WHITE: '#ffffff'
}