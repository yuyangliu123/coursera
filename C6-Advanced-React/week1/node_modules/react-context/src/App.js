import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import "./style.module.css"
import WhatIsContext from "./components/WhatIsContext";
import  ThemeContext  from "./components/LightDartThemeSwitcherLab/ThemeContext";
import Output from "./components/LightDartThemeSwitcherLab/Output";
import UsingTheuseStateHook from "./components/UsingTheuseStateHook";
import ManiginStateWithInCompoenentLab from "./components/ManiginStateWithInCompoenentLab";

function App() {
  return (
    <>
      <nav>
      <Link to="/">WhatIsContext</Link>
      <Link to="/darkmode">LightDartThemeSwitcher</Link>
      <Link to="/to-do">useState hook</Link>
      <Link to="/giftcard">ManiginStateWithInCompoenentLab</Link>
      </nav>
      <Routes>
        <Route path="/" element={<WhatIsContext/>}/>
        <Route path="/darkmode" element={<Output/>}/>
        <Route path="to-do" element={<UsingTheuseStateHook/>}/>
        <Route path="giftcard" element={<ManiginStateWithInCompoenentLab/>}/>


      </Routes>
    </>
  );
}

export default App;
