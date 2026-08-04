import React from "react"
import Board from "./components/Board"
import ToolBar from "./components/ToolBar";
import BoardProvider from "./store/BoardProvider";
import ToolConfigProvider from "./store/ToolConfigProvider"
import ToolConfigBox from "./components/ToolConfigBox"
import ToolBarProivder from "./store/ToolBarProvider"

function App() {
  // useRef is used to

  return (
    <ToolBarProivder>
    <BoardProvider>
    <ToolConfigProvider>
    <div className="App">
      <ToolBar/>
      <Board />
      <ToolConfigBox />
    </div>
    </ToolConfigProvider>
    </BoardProvider>
    </ToolBarProivder>
  );
}

export default App;
