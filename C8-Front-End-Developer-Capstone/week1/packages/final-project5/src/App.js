import './App.css';
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import theme from './theme';
import FullScreenSection from './components/FullScreenSection';
import ScrollToTop from './components/provider/ScrollToTop';
// import OrderOnlineSkeleton from './components/OrderOnline/OrderOnlineSkeleton';
// import LikeItemSkeleton from './components/OrderOnline/LikeItemSkeleton';
import LikeItemContainer from './components/OrderOnline/LikeItemContainer';
import OrderOnline2 from './components/OrderOnline/OrderOnline2';
import { Box, VStack } from '@chakra-ui/react';

const Home = lazy(() => import('./components/Home/Home'));
const FixNav = lazy(() => import('./components/FixNav'));
const Nav2 = lazy(() => import('./components/Nav/Nav2'));
const MobileNav = lazy(() => import('./components/Nav/MobileNav'));
const GlobalProvider = lazy(() => import('./GlobalProvider'));
const GlobalModal = lazy(() => import('./components/provider/GlobalModal'));
const BookingForm = lazy(() => import('./components/Booking/BookingForm'));

const Signup = lazy(() => import('./components/Register/Signup'));
const CapslockProvider = lazy(() => import('./components/provider/CheckCapslock'));

const ForgotPassword = lazy(() => import('./components/Register/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Register/ResetPassword'));

const FoodPage2 = lazy(() => import('./components/OrderOnline/FoodPage2'));
const OrderOnlineContainer = lazy(() => import('./components/OrderOnline/OrderOnlineContainer'));

const Footer = lazy(() => import('./components/Home/Footer'));
const CartPage = lazy(() => import('./components/OrderOnline/CartPage'));
const LikeItem = lazy(() => import('./components/OrderOnline/LikeItem'));
const CheckoutPage = lazy(() => import('./components/OrderOnline/CheckoutPage'))

// import BookingForm from './components/Booking/BookingForm';

// import Signup from './components/Register/Signup';
// import { CapslockProvider } from './components/provider/CheckCapslock';

// import ForgotPassword from './components/Register/ForgotPassword';
// import ResetPassword from './components/Register/ResetPassword';

// import FoodPage2 from './components/OrderOnline/FoodPage2';
// import OrderOnlineContainer from './components/OrderOnline/OrderOnlineContainer';
// // const OrderOnlineContainer = lazy(() => import('./components/OrderOnline/OrderOnlineContainer'));

// import Footer from './components/Home/Footer';
// import CartPage from './components/OrderOnline/CartPage';
// import LikeItem from './components/OrderOnline/LikeItem';
// import CheckoutPage from './components/OrderOnline/CheckoutPage';


// const client = new ApolloClient({
//   uri: 'http://localhost:5000/graphql',
//   cache: new InMemoryCache()
// });
function App() {

  return (
    <GlobalProvider>
      <GlobalModal />
      <Suspense>
        <FixNav>
          <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding="1vh 0">
            <Nav2 />
            <MobileNav />
          </FullScreenSection>
        </FixNav>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservation" element={<CapslockProvider><BookingForm /></CapslockProvider>} />
          <Route path="/order2" element={
            <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding="3vh 0" position="relative">
              {/* <OrderOnlineContainer /> */}
              <VStack w="100%" align="start" padding="10vh 0" id="menu">
                <Box position="relative" width="100%">
                  <OrderOnline2 />
                </Box>
              </VStack>
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
              {/* <LikeItem /> */}
              {/* <LikeItemSkeleton/> */}
              <LikeItemContainer />
            </FullScreenSection>}
          />
          <Route path="/signup" element={<CapslockProvider><Signup /></CapslockProvider>} />
          <Route path="/forgotpassword" element={<CapslockProvider><ForgotPassword /></CapslockProvider>} />
          <Route path="/resetpassword" element={<CapslockProvider><ResetPassword /></CapslockProvider>} />
        </Routes>
        <FullScreenSection backgroundColor="#fbdabb4d" height="auto" padding="2vh 0" bottom="0">
          {/* <Footer /> */}
        </FullScreenSection>
      </Suspense>
    </GlobalProvider>
  );
}

export default App;
