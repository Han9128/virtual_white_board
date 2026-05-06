import { TOOLS } from "../constants/toolItem"
import rough from "roughjs/bin/rough"
import getArrowCoOrdinates from "../utils/math"
import getStroke from "perfect-freehand";

const gen = rough.generator();

const generateRoughEle = (idx, x1, y1, x2, y2, tool_type, stroke, fill, size) => {

    const newElement = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        type:tool_type,
        color:stroke,

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
                type:tool_type,
                color:stroke,
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