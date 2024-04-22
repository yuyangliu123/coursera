import './App.css';
import {Route, Routes } from 'react-router-dom';
import Nav from './components/Nav/Nav';


import {ChakraProvider} from "@chakra-ui/react"
import theme from './theme';
import FullScreenSection from './components/FullScreenSection';

import Home from './components/Home/Home';
import BookingForm from './components/Booking/BookingForm';
import MobileNav from './components/Nav/MobileNav';
import FloatingNav from './components/FloatingNav';


function App() {
  return (
    <ChakraProvider theme={theme} >
      <FloatingNav>
        <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding="2vh 0">
          <Nav/>
          <MobileNav/>
        </FullScreenSection>
      </FloatingNav>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/reservation" element={<BookingForm/>}/>
      </Routes>
    </ChakraProvider>
  );
}

export default App;
