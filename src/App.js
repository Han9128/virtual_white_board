import React, {useContext} from "react"
import Board from "./components/Board"
import ToolBar from "./components/ToolBar";
import BoardProvider from "./store/BoardProvider";
import ToolConfigProvider from "./store/ToolConfigProvider"
import ToolConfigBox from "./components/ToolConfigBox"
import ToolBarProivder from "./store/ToolBarProvider"
import authContext from "./store/auth-context"
import Login from "./components/Login/index"

function App() {
  // useRef is used to
  const {isLoggedIn} = useContext(authContext)
  // we cant keep auth Provider here because we are consume aut context here so provider must wrap the app
  return (
  
    <ToolBarProivder>
    <BoardProvider>
    <ToolConfigProvider>
    <div className="App">
      {!isLoggedIn? <Login />:
      <>
      <ToolBar/>
      <Board />
      <ToolConfigBox />
      </>
      }
    </div>
    </ToolConfigProvider>
    </BoardProvider>
    </ToolBarProivder>
  );
}

export default App;
