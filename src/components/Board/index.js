import { useEffect, useLayoutEffect, useRef, useContext, useState, useCallback } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import toolConfigContext from "../../store/toolConfig-context";
import toolBarContext from "../../store/toolBar-context";
import authContext from "../../store/auth-context";
import PageLoader from "../../components/PageLoader"
import { TOOLS, SESSION_EXPIRED } from "../../constants/constants";
import classes from "./index.module.css";
import { updateCanvas, loadCanvas } from "../../services/canvasApi";
import { useParams } from "react-router"



function Board() {
  const canvasRef = useRef();
  const isDrawing = useRef(false);
  const [isWriting, setIsWriting] = useState(false);
  const textAreaRef = useRef();
  const [loader, setLoader] = useState(true);

  const { elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    textAreaBlurHandler,
    boardMouseUpHandler,
    undoHandler,
    redoHandler,
    version,
    loadCanvasHandler,
  } = useContext(boardContext);
  const { toolConfigState, setShowToolConfig } = useContext(toolConfigContext);
  const { activeToolItem } = useContext(toolBarContext);
  const { token, logout } = useContext(authContext);

  const { canvasId } = useParams();

  const latest = useRef({ token, canvasId, elements });
  const dirty = useRef(false);


  useEffect(() => {
    const fetchCanvas = async () => {

      setLoader(true);
      try {

        const data = await loadCanvas(token, canvasId);
        loadCanvasHandler(data?.canvas?.elements);
        return data;
      } catch (err) {
        console.error(err);
        // const errMessage = err.status?err.message:"Can't reach the server. Check your connection.";
        // alert(errMessage);
        if (err.status === 401) {
          return logout(SESSION_EXPIRED);
        } else loadCanvasHandler([]);
        console.error(err.message);
      } finally {
        setLoader(false);
      }
    }

    fetchCanvas();
  }, [canvasId, token, logout, loadCanvasHandler])

  const paintCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();

    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element) => {
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
  }, [elements])

  // Initialize the canvas dimensions before drawing.
  // Changing the canvas width or height resets its drawing buffer.
  // Previously, this ran in useEffect after the loaded elements were drawn
  // in useLayoutEffect, which cleared the loaded canvas.
  // Using useLayoutEffect ensures the canvas is sized before the elements are drawn. 
  const paintRef = useRef(paintCanvas);
  useLayoutEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;
    let frame = 0;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      paintRef.current()
    }

    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(handleResize);
    }

    // call it for first time when board mounts
    handleResize();
    window.addEventListener('resize', onResize);


    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize',onResize);
    }
  }, []);


  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    paintRef.current = paintCanvas;
    paintCanvas();
  }, [paintCanvas])









  const saveCanvas = useCallback(async (token, id, elements) => {
    try {
      const data = await updateCanvas(token, id, elements);
      return data;
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        return logout(SESSION_EXPIRED);
      }
    }
  }, [logout])




  useEffect(() => {

    if (isWriting) {
      const textArea = textAreaRef.current;
      textArea?.focus();
    }
  }, [isWriting])



  useEffect(() => {
    if (version === 0) return;

    if (!canvasId || !token) return;

    dirty.current = true;
    latest.current = { token, canvasId, elements };
    const timer = setTimeout(() => {
      dirty.current = false;
      saveCanvas(token, canvasId, elements);
    }, 1000)

    return () => clearTimeout(timer)
    // version changes in the same commit as elements, so the closure is always
    // fresh. Adding elements here would fire on every mousemove and save half-finished strokes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  // function and bojects are compared by reference in js so if these are passed as dependency 
  // then every render create these from scratch changing the reference which cause infinte 
  // rendering issue, thus we use useCallback, it preserves the function's identity 
  // across renders;
  const flush = useCallback(() => {
    if (!dirty.current) return;
    const { token, canvasId, elements } = latest.current;
    if (!canvasId || !token) return;
    dirty.current = false;
    saveCanvas(token, canvasId, elements);
  }, [saveCanvas]);

  useEffect(() => {
    const handlePageHide = () => {
      flush();
    }

    const handleVisibility = () => {
      if (document.hidden) {
        flush();
      }
    }

    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibility);
      flush();
    }
  }, [flush])

  useEffect(() => {
    if (isWriting) return;
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        undoHandler();
      } else if (e.ctrlKey && e.key === 'y') {
        redoHandler();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoHandler, redoHandler, isWriting])

  const handleMouseDown = (event) => {
    // Lock pointer to this element so dragging doesn't break if the cursor moves too fast or encounter edge of browser it only stops when pointer is left
    event.currentTarget.setPointerCapture(event.pointerId);
    setShowToolConfig(false)
    if (activeToolItem === TOOLS.UNDO || activeToolItem === TOOLS.REDO || activeToolItem === TOOLS.DOWNLOAD) return;
    if (activeToolItem === TOOLS.TEXT) {
      if (isWriting) return;
      event.preventDefault();
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
    if (isDrawing.current) {
      boardMouseUpHandler();
      isDrawing.current = false;
    }

  }

  const handlePointerCancel = () => {
    isDrawing.current = false;
  }


  return (
    <>
      {loader && <PageLoader />}
      {isWriting && (<textarea
        className={classes.textElementBox}
        type="text"
        ref={textAreaRef}
        style={{
          top: elements[elements.length - 1]?.y1,
          left: elements[elements.length - 1]?.x1,
          fontSize: `${elements[elements.length - 1]?.size}px`,
          color: elements[elements.length - 1]?.color,
        }}

        onBlur={(event) => { setIsWriting(false); textAreaBlurHandler(event.target.value) }}
      >
      </textarea>)}
      <div
        className={classes.board}
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
        onPointerCancel={handlePointerCancel}
      >
        <canvas id="canvas" ref={canvasRef} >
          This is canvas area
        </canvas>
      </div>
    </>
  );
}

export default Board;