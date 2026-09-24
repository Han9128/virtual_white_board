import { useContext } from "react"
import Board from "./components/Board"
import ToolBar from "./components/ToolBar";
import BoardProvider from "./store/BoardProvider";
import ToolConfigProvider from "./store/ToolConfigProvider"
import ToolConfigBox from "./components/ToolConfigBox"
import ToolBarProivder from "./store/ToolBarProvider"
import authContext from "./store/auth-context"
import Login from "./components/Login/index"
import Register from "./components/Register";
import Dashboard from "./components/Dashboard/index";
import { Routes, Route, Navigate } from "react-router";

function App() {

  const { isLoggedIn } = useContext(authContext)


  // we cant keep auth Provider here because we are consuming auth context here so provider must wrap the app
  return (

    // <ToolBarProivder>
    //   <BoardProvider>
    //     <ToolConfigProvider>
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/canvas/:canvasId"
          element={
            isLoggedIn ?
            
                <ToolBarProivder>
                  <BoardProvider>
                    <ToolConfigProvider>
                      <ToolBar />
                      <Board />
                      <ToolConfigBox />
                    </ToolConfigProvider>
                  </BoardProvider>
                </ToolBarProivder>
               :
              <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
      {/* {
              showRegister ? <Register /> :
                !isLoggedIn ? <Login /> :
                  showDashboard ? <Dashboard /> :
                    <>
                      <ToolBar />
                      <Board />
                      <ToolConfigBox />
                    </>
            } */}
        {/* </ToolConfigProvider>
      </BoardProvider>
    </ToolBarProivder> */}
    </div>

  );
}

export default App;
