
import {ARROW_LENGTH} from "../constants/toolItem"

const getArrowCoOrdinates = (x1,y1,x2,y2) => {
    const theta = Math.atan2(y2-y1,x2-x1);
    const x3 = x2 - ARROW_LENGTH*Math.cos(theta-Math.PI/6);
    const y3 = y2 - ARROW_LENGTH*Math.sin(theta-Math.PI/6);
    const x4 = x2 - ARROW_LENGTH*Math.cos(theta+Math.PI/6);
    const y4 = y2 - ARROW_LENGTH*Math.sin(theta+Math.PI/6);
    return {x3,y3,x4,y4};
}

export default getArrowCoOrdinates;