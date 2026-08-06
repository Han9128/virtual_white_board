import React, {useContext} from "react"
import Board from "./components/Board"
import ToolBar from "./components/ToolBar";
import BoardProvider from "./store/BoardProvider";
import ToolConfigProvider from "./store/ToolConfigProvider"
import ToolConfigBox from "./components/ToolConfigBox"
import ToolBarProivder from "./store/ToolBarProvider"
import authContext from "./store/auth-context"
import Login from "./components/Login/index"
import Register from "./components/Register"

function App() {
  // useRef is used to
  const {isLoggedIn, isLoading, showRegister} = useContext(authContext)

  

  // we cant keep auth Provider here because we are consume aut context here so provider must wrap the app
  return (
  
    <ToolBarProivder>
    <BoardProvider>
    <ToolConfigProvider>
    <div className="App">
      {isLoading? <p>Loading...</p>: showRegister?<Register />:  !isLoggedIn? <Login />:
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
