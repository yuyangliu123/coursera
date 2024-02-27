import logo from './logo.svg';
import './App.css';
import Dog from './components/Dog';

function App() {
const date = new Date()

  return (
    <>
    <Dog now={date.toLocaleTimeString()}/>
    </>
  );
}

export default App;
