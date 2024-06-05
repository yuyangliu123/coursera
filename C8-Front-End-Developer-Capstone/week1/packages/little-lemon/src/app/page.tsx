import {Route, Routes } from 'react-router-dom';
import Nav from "@/components/Nav/Nav"

import {ChakraProvider} from "@chakra-ui/react"
import theme from '@/app/theme';
import FullScreenSection from '@/components/FullScreenSection';

import HomePage from '@/components/Home/HomePage';
import BookingForm from '@/components/Booking/BookingForm';
import MobileNav from '@/components/Nav/MobileNav';
import Login from '@/components/Register/Login';
import Signup from '@/components/Register/Signup';
import { CapslockProvider } from '@/components/provider/CheckCapslock';
import { TokenProvider } from '@/components/provider/JwtToken';
import LoginRotate from '@/components/Register/LoginRotate';
import { TokenRotateProvider } from '@/components/provider/JwtTokenRotate';
import FixNav from '@/components/FixNav';
import ForgotPassword from '@/components/Register/ForgotPassword';
import ResetPassword from '@/components/Register/ResetPassword';
import OrderOnlinePage from '@/components/OrderOnline/OrderOnlinePage';

export default function Home() {
  return(
    <ChakraProvider theme={theme} >
      <FixNav>
        <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding="2vh 0">
        <TokenProvider>
          <TokenRotateProvider>
            <Nav/>
            <MobileNav/>
          </TokenRotateProvider>
        </TokenProvider>
        </FullScreenSection>
        </FixNav>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/reservation" element={<CapslockProvider><TokenRotateProvider><BookingForm/></TokenRotateProvider></CapslockProvider>}/>
        <Route path="/order" element={
          <FullScreenSection backgroundColor="#FFFFFF" height="1000px" padding="3vh 0">
            <TokenRotateProvider>
              <OrderOnlinePage/>
            </TokenRotateProvider>
          </FullScreenSection>}
        />
        <Route path="/login" element={<CapslockProvider><Login/></CapslockProvider>}/>
        <Route path="/loginrotate" element={<CapslockProvider><LoginRotate/></CapslockProvider>}/>
        <Route path="/signup" element={<CapslockProvider><Signup/></CapslockProvider>}/>
        <Route path="/forgotpassword" element={<CapslockProvider><ForgotPassword/></CapslockProvider>}/>
        <Route path="/resetpassword" element={<CapslockProvider><ResetPassword/></CapslockProvider>}/>
      </Routes>
    </ChakraProvider>
  )
}
