import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Password from "./components/Password/Password";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Management from "./components/Management/Management";

function App() {
  const [authenticated, setAuthenticated] = React.useState(false);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Main />} />
          <Route
            path="login"
            element={
              <Login
                setAuthenticated={setAuthenticated}
                authenticated={authenticated}
              ></Login>
            }
          />
          <Route path="password" element={<Password />} />
          <Route
            path="management"
            element={
              <ProtectedRoute authenticated={authenticated}>
                <Management />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
