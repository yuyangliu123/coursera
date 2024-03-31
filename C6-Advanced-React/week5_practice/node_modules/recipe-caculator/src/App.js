import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import IngredientList from "./components/IngredientList";
import Ingredient2 from "./components/Ingredient2";

function App() {
  const handleSubmit=()=>{
    console.log("Form submitted");
  }

  return (
    <>
      <nav>
      <Link to="/">Recipe</Link>
      <Link to="/ingre2">Ingre2</Link>
      </nav>
      <Routes>
        <Route path="/" element={<IngredientList/>}/>
        <Route path="/ingre2" element={<Ingredient2/>}/>
      </Routes>
    </>
  );
}

export default App;

