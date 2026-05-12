import { TOOLS } from "../constants/toolItem"
import rough from "roughjs/bin/rough"
import getArrowCoOrdinates, { distance } from "../utils/math"
import getStroke from "perfect-freehand";
import { ERASE_THRESHOLD } from "../constants/toolItem"

const gen = rough.generator();

const generateRoughEle = (idx, x1, y1, x2, y2, tool_type, stroke, fill, size) => {

    const newElement = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        type: tool_type,
        color: stroke,
        size: size,

    }
    const options = {
        seed: idx + 1,
        fillStyle: 'solid',
    }

    if (stroke) {
        options.stroke = stroke;
    } if (fill) {
        options.fill = fill;
    } if (size) {
        options.strokeWidth = size;
    }

    // console.log(tool_type);
    // console.log(newElement);
    switch (tool_type) {
        case TOOLS.BRUSH: {
            const brushElement = {
                points: [{ x: x1, y: y1 }],
                path: new Path2D(getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }]))),
                type: tool_type,
                color: stroke,
            }

            return brushElement;
        }
        case TOOLS.LINE: {
            newElement.roughElement = gen.line(x1, y1, x2, y2, options);
            return newElement;
        }

        case TOOLS.RECTANGLE: {
            newElement.roughElement = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options)
            return newElement;
        }

        case TOOLS.CIRCLE: {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            // const diameter = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
            // for ellipse
            const width = x2 - x1;
            const height = y2 - y1;
            newElement.roughElement = gen.ellipse(cx, cy, width, height, options)
            return newElement;
        }
        case TOOLS.ARROW_RIGHT: {
            const { x3, y3, x4, y4 } = getArrowCoOrdinates(x1, y1, x2, y2);
            const points = [
                [x1, y1],
                [x2, y2],
                [x3, y3],
                [x2, y2],
                [x4, y4]
            ]
            newElement.roughElement = gen.linearPath(points, options)
            return newElement;
        }
        case TOOLS.TEXT:
            {
                // console.log(`in text: ${newElement}`);
                newElement.text = "";
                // console.log(`text: ${newElement.y1}`);
                return newElement;
            }
        default:
            break;
    }

}



export function isNearPointElement(element, x, y, tool) {
    switch (element.type) {
        case TOOLS.LINE:
        case TOOLS.ARROW_RIGHT:
            {
                const { x1, y1, x2, y2 } = element;
                const d = distance(x1, x2, y1, y2);
                const d1 = distance(x1, x, y1, y);
                const d2 = distance(x2, x, y2, y);
                return Math.abs(d1 + d2 - d) < ERASE_THRESHOLD;
            }

        case TOOLS.RECTANGLE:
        case TOOLS.CIRCLE:
            {
                // console.log("rectangel")
                const { x1, y1, x2, y2 } = element;
                // console.log(element);
                // console.log(x1,x2,y1,y2);
                const [x3, y3] = [x2, y1];
                const [x4, y4] = [x1, y2];
                // console.log(x3,y3,x4,y4);
                let d = distance(x1, x3, y1, y3);
                let d1 = distance(x1, x, y1, y);
                let d2 = distance(x3, x, y3, y);
                const isClose1 = Math.abs(d1 + d2 - d) < ERASE_THRESHOLD;
                d = distance(x3, x2, y3, y2);
                d1 = distance(x2, x, y2, y);
                const isClose2 = Math.abs(d1 + d2 - d) < ERASE_THRESHOLD;
                d = distance(x2, x4, y2, y4);
                d2 = distance(x4, x, y4, y);
                const isClose3 = Math.abs(d1 + d2 - d) < ERASE_THRESHOLD;
                d = distance(x1, x4, y1, y4);
                d1 = distance(x1, x, y1, y);
                const isClose4 = Math.abs(d1 + d2 - d) < ERASE_THRESHOLD;

                return (isClose1 || isClose2 || isClose3 || isClose4);
            }
        case TOOLS.BRUSH:
            {
                const { path } = element;
                const context = document.getElementById("canvas").getContext("2d");
                return context.isPointInPath(path, x, y);
            }

        case TOOLS.TEXT:
            {
                const context = document.getElementById("canvas").getContext("2d");
                context.font = `${element.size}px Caveat`;
                context.fillStyle = element.color;
                const textWidth = context.measureText(element.text).width;
                const textHeight = parseInt(element.size);
                context.restore();

                const { x1, y1} = element;
                // console.log(element);
                // console.log(x1,x2,y1,y2);
                const [x2,y2] = [x1+textWidth,y1-textHeight];
                const [x3, y3] = [x2, y1];
                const [x4, y4] = [x1, y2];
                // console.log(x3,y3,x4,y4);
                let d = distance(x1, x3, y1, y3);
                let d1 = distance(x1, x, y1, y);
                let d2 = distance(x3, x, y3, y);
                const isClose1 = Math.abs(d1 + d2 - d) < ERASE_THRESHOLD;
                d = distance(x3, x2, y3, y2);
                d1 = distance(x2, x, y2, y);
                const isClose2 = Math.abs(d1 + d2 - d) < ERASE_THRESHOLD;
                d = distance(x2, x4, y2, y4);
                d2 = distance(x4, x, y4, y);
                const isClose3 = Math.abs(d1 + d2 - d) < ERASE_THRESHOLD;
                d = distance(x1, x4, y1, y4);
                d1 = distance(x1, x, y1, y);
                const isClose4 = Math.abs(d1 + d2 - d) < ERASE_THRESHOLD;

                return (isClose1 || isClose2 || isClose3 || isClose4);
            }

        default:
            break;
    }
}

export function getSvgPathFromStroke(stroke) {
    if (!stroke.length) return ""

    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length]
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
            return acc
        },
        ["M", ...stroke[0], "Q"]
    )

    d.push("Z")
    return d.join(" ")
}

export default generateRoughEle;