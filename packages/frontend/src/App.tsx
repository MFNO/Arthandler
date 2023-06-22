import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Password from "./components/Password/Password";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Main />} />
          <Route path="login" element={<Login />} />
          <Route path="password" element={<Password />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
