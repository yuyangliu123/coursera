import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import styled from "./style.module.css"

import { RandomNum, Random } from './components/Random';

function App() {
  return(
    <div className={styled.App}>
      <Header/>
      <div className={styled.subArticle}>
        <Main name="Mack" num={5}/>
        <Sidebar/>
      </div>
      <Random/>
      
    </div>
    
  )
}

export default App;
