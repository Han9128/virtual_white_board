import React from "react"
import Board from "./components/Board"
import ToolBar from "./components/ToolBar";
import BoardProvider from "./store/BoardProvider";

function App() {
  // useRef is used to
  

  return (
    <BoardProvider>
    <div className="App">
      <ToolBar/>
      <Board />
    </div>
    </BoardProvider>
  );
}

export default App;
