import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import style from "./style.module.css"
function App() {
  return(
    <div>
      <Header name="abc" color="red"/>
      <Main greeting="Hello"/>
      <Sidebar greeting="Hi"/>
    </div>
  )
}

export default App;
