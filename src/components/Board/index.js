import {useEffect, useRef} from "react";
import rough from "roughjs";


function Board(){
    const canvasRef = useRef();
  useEffect(()=>{
    const canvas = canvasRef.current;
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    const roughCanvas = rough.canvas(canvas);
    const generator = roughCanvas.generator;
    const rect1 = generator.rectangle(10,10,100,100);
    const rect2 = generator.rectangle(60,60,100,100);
    // const context = canvas.getContext("2d");
    roughCanvas.draw(rect1);
    roughCanvas.draw(rect2);
    // context.fillStyle = "#FF0000";
    // context.fillRect(0,0,150,75);
  },[]);

  return (
    <div className="board">
    <canvas ref={canvasRef} width="700" height="700" style={{border:"1px solid black"}}>
        This is canvas area
      </canvas>
      <h1>My Whiteboard app</h1>
      </div>
  );
}

export default Board;