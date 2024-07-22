import './App.css';
import { Route, Routes } from 'react-router-dom';


import { Box, ChakraProvider } from "@chakra-ui/react"
import theme from './theme';
import FullScreenSection from './components/FullScreenSection';

import Home from './components/Home/Home';
import BookingForm from './components/Booking/BookingForm';
import MobileNav from './components/Nav/MobileNav';
import Signup from './components/Register/Signup';
import { CapslockProvider } from './components/provider/CheckCapslock';
import LoginRotate from './components/Register/LoginRotate';
import { TokenRotateProvider } from './components/provider/JwtTokenRotate';
import { MealContextProvider } from './components/provider/MealContext';
import FixNav from './components/FixNav';
import ForgotPassword from './components/Register/ForgotPassword';
import ResetPassword from './components/Register/ResetPassword';


import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Nav2 from './components/Nav/Nav2';
import FoodPage2 from './components/OrderOnline/FoodPage2';
import OrderOnlinePage2 from './components/OrderOnline/OrderOnlinePage2';
import Footer from './components/Home/Footer';
import CartPage from './components/OrderOnline/CartPage';
import LikeItem from './components/OrderOnline/LikeItem';
import CheckoutPage from './components/OrderOnline/CheckoutPage';
import client from './components/provider/apollo-client';
// const client = new ApolloClient({
//   uri: 'http://localhost:5000/graphql',
//   cache: new InMemoryCache()
// });
function App() {
  return (
    <TokenRotateProvider>
    <ChakraProvider theme={theme}>
        <MealContextProvider>
          <ApolloProvider client={client}>
            <FixNav>
              <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding="2vh 0">
                <Nav2 />
                <MobileNav />
              </FullScreenSection>
            </FixNav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reservation" element={<CapslockProvider><BookingForm /></CapslockProvider>} />
              <Route path="/order2" element={
                <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding="3vh 0" position="relative">
                    <OrderOnlinePage2 />
                </FullScreenSection>}
              />
              <Route path="/order2/:strMeal" element={
                <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding="3vh 0">
                  <FoodPage2 />
                </FullScreenSection>}
              />
              <Route path="/cart" element={
                <FullScreenSection backgroundColor="#FFFFFF" height="auto" minHeight="67vh" padding="12vh 0">
                  <CartPage />
                </FullScreenSection>}
              />
              <Route path="/checkout" element={
                <FullScreenSection backgroundColor="#FFFFFF" height="auto" minHeight="67vh" padding="12vh 0">
                  <CheckoutPage />
                </FullScreenSection>}
              />
              <Route path="/like" element={
                <FullScreenSection backgroundColor="#FFFFFF" height="auto" minHeight="67vh" padding="12vh 0">
                  <LikeItem />
                </FullScreenSection>}
              />
              <Route path="/loginrotate" element={<CapslockProvider><LoginRotate /></CapslockProvider>} />
              <Route path="/signup" element={<CapslockProvider><Signup /></CapslockProvider>} />
              <Route path="/forgotpassword" element={<CapslockProvider><ForgotPassword /></CapslockProvider>} />
              <Route path="/resetpassword" element={<CapslockProvider><ResetPassword /></CapslockProvider>} />
            </Routes>
            <FullScreenSection backgroundColor="#fbdabb4d" height="auto" padding="2vh 0" bottom="0">
                <Footer />
            </FullScreenSection>
          </ApolloProvider>
        </MealContextProvider>
      
    </ChakraProvider>
    </TokenRotateProvider>
  );
}

export default App;
