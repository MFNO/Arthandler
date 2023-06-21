import "./App.css";
import Login from "./components/Login/Login";
import Main from "./components/Main/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (<BrowserRouter>
    <Routes>
      <Route index element={<Main />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>)

}

export default App;
