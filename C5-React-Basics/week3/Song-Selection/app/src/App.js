import logo from './logo.svg';
import './App.css';
import ReactPlayer from 'react-player';

import './App.css';
import Homepage from './components/Homepage';
import AboutMe from './components/AboutMe';
import {Routes, Route, Link} from "react-router-dom"

import Contact from './components/Contact';
import Testtext from './components/Testtext';
import Time from './components/Time';
import CurrentMessage from './components/CurrentMessage';
function App() {
  const url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  const bird1 = new Audio(
    "https://upload.wikimedia.org/wikipedia/commons/9/9b/Hydroprogne_caspia_-_Caspian_Tern_XC432679.mp3"
  );

  const bird2 = new Audio(
    "https://upload.wikimedia.org/wikipedia/commons/b/b5/Hydroprogne_caspia_-_Caspian_Tern_XC432881.mp3"
  )

  function toggle1() {
    if (bird1.paused) {
      bird1.play();
    } else {
      bird1.pause();
    }
  };
  function toggle2() {
    if (bird2.paused) {
      bird2.play();
    } else {
      bird2.pause();
    }
  }
  const week= new Date().getDay()
  const time= new Date()

  return (
    <>
    <h1 style={{textAlign:"center"}}>React Player example</h1>
    <ReactPlayer 
      url={url}
      playing={true}
      volume={0.2}
      controls={true}
    />
      
      <button onClick={toggle1}>Caspian Tern 1</button>
      <button onClick={toggle2}>Caspian Tern 2</button>
      
    
      <nav>
      <Link to="/" className='nav-item'>Homepage</Link>
      <Link to="/about-me" className='nav-item'>About Me</Link>
      <Link to="/contact" className='nav-item'>Contact</Link>
    </nav>
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/about-me' element={<AboutMe/>}/>
      <Route path='/contact' element={<Contact/>}></Route>
    </Routes>
    
    <Testtext/>
    <p>now is {time.toString()}</p>
    <CurrentMessage day={week}/>
    <Time/>
    
    </>
  );
}

export default App;
