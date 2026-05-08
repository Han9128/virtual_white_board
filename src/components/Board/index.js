import {useEffect, useLayoutEffect,useRef, useContext, useState} from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import toolConfigContext from "../../store/toolConfig-context";
import toolBarContext from "../../store/toolBar-context";
import {TOOLS} from "../../constants/toolItem";
import classes from "./index.module.css"



function Board(){
    const canvasRef = useRef();
    const isDrawing = useRef(false);
    const isWriting = useRef(false);
    
    const {elements, boardMouseDownHandler,boardMouseMoveHandler} = useContext(boardContext);
    const {toolConfigState} = useContext(toolConfigContext);
    const {activeToolItem}  = useContext(toolBarContext);
    // console.log(elements);
    
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
      console.log('Element type:', element.type, 'TOOLS.TEXT:', TOOLS.TEXT, 'Match:', element.type === TOOLS.TEXT);
      if(element.type === TOOLS.BRUSH){
        context.fillStyle = element.color
        context.fill(element.path);
        context.restore();
      }else if(element.type === TOOLS.TEXT){
        console.log('something');
      }
      else{
        roughCanvas.draw(element.roughElement);
      }
    })

    return ()=>{
      context.clearRect(0,0,canvas.width,canvas.height);
    }
  }, [elements])


  // useEffect(()=>{
  //   isWriting.cu
  // },[isWriting])

const handleMouseDown = (event)=>{
  if(activeToolItem === TOOLS.TEXT){
    // console.log(activeToolItem);
    console.log(TOOLS.TEXT);
    // isWriting.current = true;
    boardMouseDownHandler(event, toolConfigState, isWriting);
    isWriting.current = true;
    // console.log(elements);
  }else{
    isDrawing.current = true;
    boardMouseDownHandler(event, toolConfigState,isWriting);
  }
}

const handleMouseMove = (event) =>{
  if(!isDrawing.current) return
  boardMouseMoveHandler(event, toolConfigState);
}

const handleMouseUp = ()=>{
  isWriting.current=false;
  isDrawing.current = false;
}

console.log(elements);
  return (
    <>
    {isWriting.current && (<textarea 
    className={classes.textElementBox}
    type="text" 
    style={{
      top: elements[elements.length-1].y1,
      left: elements[elements.length-1].x1,
      fontSize: `${elements[elements.length-1].stroke}px`,
      color: elements[elements.length-1].color,
    }}
    >
      {/* this is text area; */}
      </textarea>)}
    <div className="board" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
    <canvas id="canvas" ref={canvasRef}>
        This is canvas area
      </canvas>
      </div>
      </>
  );
}

export default Board;