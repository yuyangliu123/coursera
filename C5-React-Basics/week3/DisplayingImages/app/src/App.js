import logo from './logo.svg';
import './App.css';
import Logo from "./assets/src/logo1.jpg"
function App() {
  const logourl="https://yt3.googleusercontent.com/ZlovVsPyh8NgS37S4dfONiCBySiboGPbT9cYuirb8JM3JhSnqlpJk-8SQUEA7jPfqXpMvjaa=s176-c-k-c0x00ffffff-no-rj"
  return (
    <>
    
    <img src={require("./assets/src/logo.jpg")} alt="Logo"></img>
    <img src={Logo} alt="Logo"></img>
    <img src={logourl} alt="Logo"></img>
    </>
    
    
    
  );
}

export default App;
