import logo from './logo.svg';
import './App.css';
import Homepage from './components/Homepage';
import AboutMe from './components/AboutMe';
import {Routes, Route, Link} from "react-router-dom"

import Contact from './components/Contact';
import Testtext from './components/Testtext';
import Time from './components/Time';
import Moon from './components/Moon';
import CurrentMessage from './components/CurrentMessage';

function App() {
  const week= new Date().getDay()
  const time= new Date()

  return (
    <>
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
