import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import Nav from './components/nav';

function App() {
  return (
    <>
    <nav>
      <Link to="/">nav</Link>
    </nav>

    <Routes>
      <Route path='/' element={<Nav/>}/>
    </Routes>
    </>
  );
}

export default App;
