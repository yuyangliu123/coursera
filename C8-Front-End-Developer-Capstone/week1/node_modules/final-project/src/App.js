import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';


import {ChakraProvider} from "@chakra-ui/react"
import theme from './theme';
import FullScreenSection from './components/FullScreenSection';

import Home from './components/Home/Home';
import BookingPage from './components/Booking/BookingPage';
import BookingForm2 from './components/Booking/BookingForm2';
import BookingForm3 from './components/Booking/BookingForm3';


function App() {
  return (
    <ChakraProvider theme={theme} >
      <FullScreenSection backgroundColor="#FFFFFF" height="100px" padding="30px 0 0">
      <Nav/>
      </FullScreenSection>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/reservation" element={<BookingForm3/>}/>
        <Route path="/order" element={<BookingPage/>}/>
        <Route path="/login" element={<BookingForm2/>}/>
      </Routes>
    </ChakraProvider>
  );
}

export default App;
