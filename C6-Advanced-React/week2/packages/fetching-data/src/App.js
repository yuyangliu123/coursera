import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import "./style.module.css"
import Fetching from "./components/Fetching";
import FetchDataLab from "./components/FetchDataLab";
import FetchPractice from "./components/FetchPractice";

function App() {
  return (
    <>
      <nav>
      <Link to="/">Fetching</Link>
      <Link to="/fetchdata">FetchDataLab</Link>
      <Link to="/fetchPractice">FetchPractice</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Fetching/>}/>
        <Route path="/fetchdata" element={<FetchDataLab/>}/>
        <Route path="/fetchPractice" element={<FetchPractice/>}/>

      </Routes>
    </>
  );
}

export default App;
