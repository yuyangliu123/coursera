import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import Dessert from "./components/Dessert";
import Dessert1 from "./components/Dessert1";
import Caculator from "./components/Caculator";
import DessertWork from "./components/DessertWork";




function App() { 

  return(
    <>
    <nav>
      <Link to="/">Dessert</Link>
      <Link to="/dessert">Dessert1</Link>
      <Link to="/dessertwork">DessertWork</Link>
      <Link to="/caculator">Caculator</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Dessert/>}/>
      <Route path="/dessert" element={<Dessert1/>}/>
      <Route path="/dessertwork" element={<DessertWork/>}/>
      <Route path="/caculator" element={<Caculator/>}/>
    </Routes>
    </>
  )
} 
 
export default App;