import {TOOLS} from "../constants/toolItem"
import rough from "roughjs/bin/rough"

const gen = rough.generator();

const generateRoughEle = (idx, x1, y1, x2, y2, tool_type ) => {

    const newElement = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,

    }
    const options ={
        seed: idx+1,
    }
    // console.log(tool_type);
    // console.log(newElement);
    switch (tool_type) {
        case TOOLS.LINE: {
            newElement.roughElement = gen.line(x1,y1,x2,y2, options);
            return newElement;
        }

        case TOOLS.RECTANGLE: {
            newElement.roughElement = gen.rectangle(x1,y1,x2-x1,y2-y1, options)
            return newElement;
        }
        case TOOLS.CIRCLE: {
            const cx = (x1+x2)/2;
            const cy = (y1+y2)/2;
            // const diameter = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
            // for ellipse
            const width = x2-x1;
            const height = y2-y1;
            newElement.roughElement = gen.ellipse(cx,cy,width,height, options)
            return newElement;
        }

        default:
            break;
    }

}

export default generateRoughEle;