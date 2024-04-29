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
import Login from './components/Register/Login';
import Signup from './components/Register/Signup';
import { CapslockProvider } from './components/provider/CheckCapslock';
import { TokenProvider } from './components/provider/JwtToken';

function App() {

  return (
    <ChakraProvider theme={theme} >
      
      <FloatingNav>
        <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding="2vh 0">
        <TokenProvider>
          <Nav/>
          <MobileNav/>
        </TokenProvider>
          
        </FullScreenSection>
      </FloatingNav>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/reservation" element={<BookingForm/>}/>
        <Route path="/login" element={<CapslockProvider><Login/></CapslockProvider>}/>
        <Route path="/signup" element={<CapslockProvider><Signup/></CapslockProvider>}/>
      </Routes>
      
    </ChakraProvider>
  );
}

export default App;
