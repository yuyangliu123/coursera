import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import "./style.module.css"
import UseRefToAccessDOM from "./components/UseRefToAccessDOM";
import PreviousDay from "./components/customHookLab/PreviousDay";

function App() {
  return (
    <>
      <nav>
      <Link to="/">useRef</Link>
      <Link to="/getday">useRef</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UseRefToAccessDOM/>}/>
        <Route path="/getday" element={<PreviousDay/>}/>

      </Routes>
    </>
  );
}

export default App;