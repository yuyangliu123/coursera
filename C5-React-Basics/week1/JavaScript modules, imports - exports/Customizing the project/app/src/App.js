import logo from './logo.svg';
import './App.css';
import Nav from "./components/Nav.js"
import Promo from "./components/Promo.js"
import Intro1 from './components/Intro1.js';
import Intro2 from './components/Intro2';
import Intro3 from './components/Intro3';
import Footer from './components/Footer';
function App() {
  return(
    <>
    <Promo/>
    <Nav />
    <Intro1/>
    <Intro2/>
    <Intro3/>
    <Footer/>
    </>
  )
}

export default App;
