import logo from './logo.svg';
import './App.css';

const Heading =()=>{
  return (
    <>
    <h1 style={{"color": 'red'}}>This is an h1 heading</h1>
    <div style={{"font-size": "30px"}}> test text</div>
    </>
  
  )
}

function App() {
  return (
    <>
    <div id="first">
      this is my first react app
      
    </div>
    <Heading/>
    </>
  )
}

export default App;

