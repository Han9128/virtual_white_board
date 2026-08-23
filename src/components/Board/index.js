import { useEffect, useLayoutEffect, useRef, useContext, useState } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import toolConfigContext from "../../store/toolConfig-context";
import toolBarContext from "../../store/toolBar-context";
import authContext from "../../store/auth-context"
import { TOOLS } from "../../constants/constants";
import classes from "./index.module.css";
import { updateCanvas } from "../../services/canvasApi"



function Board() {
  const canvasRef = useRef();
  const isDrawing = useRef(false);
  const [isWriting, setIsWriting] = useState(false);
  const textAreaRef = useRef();

  const { elements, boardMouseDownHandler, boardMouseMoveHandler, textAreaBlurHandler, boardMouseUpHandler, undoHandler, redoHandler, canvasId, version } = useContext(boardContext);
  const { toolConfigState } = useContext(toolConfigContext);
  const { activeToolItem } = useContext(toolBarContext);
  const { token } = useContext(authContext);


  // Initialize the canvas dimensions before drawing.
  // Changing the canvas width or height resets its drawing buffer.
  // Previously, this ran in useEffect after the loaded elements were drawn
  // in useLayoutEffect, which cleared the loaded canvas.
  // Using useLayoutEffect ensures the canvas is sized before the elements are drawn. 
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);


  const saveCanvas = async (token, id, elements) => {
    try {
      console.log(elements);
      const data = await updateCanvas(token, id, elements);
      return data;
    } catch (err) {
      console.error(err.message);
    }
  }



  // when we are just dealing with dom and want to run side effects with dom update synchronously then the best hook is useLayoutEffect,
  // and for calling third party apis, communicating with network we use useEffect.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();

    const roughCanvas = rough.canvas(canvas);
    console.log("in layout effect", elements);
    elements.forEach((element) => {
      console.log({
        type: element.type,
        roughElement: element.roughElement,
        path: element.path,
        x1: element.x1,
        y1: element.y1,
        x2: element.x2,
        y2: element.y2
      });
      if (element.type === TOOLS.BRUSH) {
        context.fillStyle = element.color
        context.fill(element.path);
        context.restore();
      } else if (element.type === TOOLS.TEXT) {
        context.textBaseline = "top";
        context.font = `${element.size}px Caveat`;
        context.fillStyle = element.color;
        context.fillText(element.text, element.x1, element.y1);
        context.restore();
      }
      else {
        roughCanvas.draw(element.roughElement);
      }
    })

    // if (shouldSaveRef.current) {
    //   saveCanvas(token, canvasId, elements);
    //   shouldSaveRef.current = false;
    // }

    return () => {
      console.log("cleanup");
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [elements])

  useEffect(() => {

    if (isWriting) {
      const textArea = textAreaRef.current;
      textArea?.focus();
    }
  }, [isWriting])



  useEffect(() => {
     if(version===0) return;

     if(!canvasId || !token) return;
     const timer = setTimeout(()=>{
      saveCanvas(token,canvasId,elements);
     },1000)

     return () => clearTimeout(timer)
     // version changes in the same commit as elements, so the closure is always
      // fresh. Adding elements here would fire on every mousemove and save half-finished strokes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[version])

  useEffect(() => {

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        undoHandler();
      } else if (e.ctrlKey && e.key === 'y') {
        redoHandler();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoHandler, redoHandler])

  const handleMouseDown = (event) => {
    if (activeToolItem === TOOLS.UNDO || activeToolItem === TOOLS.REDO || activeToolItem === TOOLS.DOWNLOAD) return;
    if (activeToolItem === TOOLS.TEXT) {
      setIsWriting(true);
      boardMouseDownHandler(event, toolConfigState, isWriting);

    } else {
      isDrawing.current = true;
      boardMouseDownHandler(event, toolConfigState, isWriting);
    }
  }

  const handleMouseMove = (event) => {
    if (!isDrawing.current) return
    boardMouseMoveHandler(event, toolConfigState);
  }

  const handleMouseUp = () => {
    setIsWriting(false);
    if (isDrawing.current) {
      boardMouseUpHandler();
      isDrawing.current = false;
    }

  }

   

  return (
    <>
      {isWriting && (<textarea
        className={classes.textElementBox}
        type="text"
        ref={textAreaRef}
        style={{
          top: elements[elements.length - 1].y1,
          left: elements[elements.length - 1].x1,
          fontSize: `${elements[elements.length - 1].size}px`,
          color: elements[elements.length - 1].color,
        }}

        onBlur={(event) => { textAreaBlurHandler(event.target.value) }}
      >
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