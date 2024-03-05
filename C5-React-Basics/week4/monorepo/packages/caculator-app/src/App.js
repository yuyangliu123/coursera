import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import Caculator1 from "./components/Caculator1";
import Caculator2 from "./components/Caculator2";

function App() { 
  return(
    <>
    <h1>Caculator</h1>
    <nav>
      <Link to="/Caculator1" className="nav-item">Caculator1</Link>
      <Link to="/Caculator2" className="nav-item">Caculator2</Link>
    </nav>
    <Routes>
      <Route path="/Caculator1" element={<Caculator1/>}/>
      <Route path="/Caculator2" element={<Caculator2/>}/>
    </Routes>

    </>
  )
} 
 
export default App;