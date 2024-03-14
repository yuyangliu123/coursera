import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import "./style.module.css"
import Dialog from "./components/Dialog";
import BuildaRadioGroupComponent from "./components/BuildaRadioGroupComponent";
import HOC from "./components/HOC";
import RenderProps from "./components/RenderProps";
import ImplementingScroller from "./components/ImplementingScroller";
import FeedbackForm from "./components/FeedbackForm";

function App() {
  const handleSubmit=()=>{
    console.log("Form submitted");
  }

  return (
    <>
      <nav>
      <Link to="/">Dialog</Link>
      <Link to="/radio">radio group</Link>
      <Link to="/HOC">HOC</Link>
      <Link to="/renderprops">Render Props</Link>
      <Link to="/scroller">Scroller</Link>
      <Link to="/feedback">Feedback</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dialog/>}/>
        <Route path="/radio" element={<BuildaRadioGroupComponent/>}/>
        <Route path="/HOC" element={<HOC/>}></Route>
        <Route path="/renderprops" element={<RenderProps/>}/>
        <Route path="/scroller" element={<ImplementingScroller/>}/>
        <Route path="/feedback" element={<FeedbackForm onSubmit={handleSubmit}/>}/>
      </Routes>
    </>
  );
}

export default App;
