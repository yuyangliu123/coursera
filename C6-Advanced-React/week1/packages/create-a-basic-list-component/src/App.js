import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import Dessert from "./components/Dessert";
import Dessert1 from "./components/Dessert1";
import Caculator from "./components/Caculator";
import DessertWork from "./components/DessertWork";
import UsingKeysWithinListComponents from "./components/UsingKeysWithinListComponents";




function App() { 

  return(
    <>
    <nav>
      <Link to="/">Dessert</Link>
      <Link to="/dessert">Dessert1</Link>
      <Link to="/dessertwork">DessertWork</Link>
      <Link to="/caculator">Caculator</Link>
      <Link to="/UsingKeysWithinListComponents">UsingKeysWithinListComponents</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Dessert/>}/>
      <Route path="/dessert" element={<Dessert1/>}/>
      <Route path="/dessertwork" element={<DessertWork/>}/>
      <Route path="/caculator" element={<Caculator/>}/>
      <Route path="/UsingKeysWithinListComponents" element={<UsingKeysWithinListComponents/>}/>
    </Routes>
    </>
  )
} 
 
export default App;