import {useEffect, useLayoutEffect,useRef, useContext} from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context"



function Board(){
    const canvasRef = useRef();
    const isDrawing = useRef(false);
    const {elements, boardMouseDownHandler,boardMouseMoveHandler} = useContext(boardContext);
  useEffect(()=>{
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // const roughCanvas = rough.canvas(canvas);
    // const generator = roughCanvas.generator;
    // const rect1 = generator.rectangle(10,10,100,100);
    // const rect2 = generator.rectangle(60,60,100,100);
    // // const context = canvas.getContext("2d");
    // roughCanvas.draw(rect1);
    // roughCanvas.draw(rect2);
    // // context.fillStyle = "#FF0000";
    // context.fillRect(0,0,150,75);
  },[]);

  // when we are just dealing with dom and want to run side effects with dom update synchronously then the best hook is useLayoutEffect,
  // and for calling third party apis, communicating with network we use useEffect
  useLayoutEffect(()=>{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();
    
    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element)=>{
      roughCanvas.draw(element.roughElement);
    })

    return ()=>{
      context.clearRect(0,0,canvas.width,canvas.height);
    }
  }, [elements])

const handleMouseDown = (event)=>{
  isDrawing.current = true;
  boardMouseDownHandler(event);
}

const handleMouseMove = (event) =>{
  if(!isDrawing.current) return
  boardMouseMoveHandler(event);
}

const handleMouseUp = ()=>{
  isDrawing.current = false;
}

  return (
    <div className="board" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
    <canvas ref={canvasRef}>
        This is canvas area
      </canvas>
      </div>
  );
}

export default Board;