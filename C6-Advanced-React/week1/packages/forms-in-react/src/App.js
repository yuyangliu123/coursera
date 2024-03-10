import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import ControlledVSUncontrolled from "./components/ControlledVSUncontrolled";
import CreatingAFormComponentInReactUncontroll from "./components/CreatingAFormComponentInReactUncontroll";
import CreatingAFormComponentInReactControll from "./components/CreatingAFormComponentInReactControll";
import CreateaControlledFormComponent from "./components/CreateaControlledFormComponent";
import CreateaRegistrationForm from "./components/CreateaRegistrationForm";
import "./style.module.css"




function App() { 

  return(
    <>
    <nav>
      <Link to="/">ControlledVSUncontrolled</Link>
      <Link to="/form-un">Uncontroll</Link>
      <Link to="/form-co">Controll</Link>
      <Link to="/form-feedback">Controll</Link>
      <Link to="/registration">Register</Link>
    </nav>
    <Routes>
      <Route path="/" element={<ControlledVSUncontrolled/>}/>
      <Route path="/form-un" element={<CreatingAFormComponentInReactUncontroll/>}/>
      <Route path="/form-co" element={<CreatingAFormComponentInReactControll/>}/>
      <Route path="/form-feedback" element={<CreateaControlledFormComponent/>}/>
      <Route path="/registration" element={<CreateaRegistrationForm/>}/>


    </Routes>
    </>
  )
} 
 
export default App;
