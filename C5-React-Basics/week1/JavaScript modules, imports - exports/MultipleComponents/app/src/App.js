import logo from './logo.svg';
import './App.css';
import Card from './components/Card';

function App() {
  return(
    <>
    <h1>Task: Add three Card elements</h1>
    <Card h2="Frist card's h2"/>
    <Card h3="First card's h3"/>
    <Card h2="Second card's h2" h3="Second card's h3"/>
    </>
  )
}

export default App;
