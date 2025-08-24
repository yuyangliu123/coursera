import './App.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid"
import Cookies from "js-cookie"
import theme from './theme';
import FullScreenSection from './components/FullScreenSection';
import ScrollToTop from './components/provider/ScrollToTop';
// import OrderOnlineSkeleton from './components/OrderOnline/OrderOnlineSkeleton';
// import LikeItemSkeleton from './components/OrderOnline/LikeItemSkeleton';
import LikeItemContainer from './components/OrderOnline/LikeItemContainer';
import OrderOnline2 from './components/OrderOnline/OrderOnline2';
import { background, Box, ChakraProvider, Image, Spinner, VStack } from '@chakra-ui/react';
import CheckoutPageSkeleton from './components/CheckoutPage/CheckoutPageSkeleton';
import StickyNav from './components/provider/StickyNav';
import globalConfig from './components/globalConfig';
import LoadingLogo from './LoadingLogo';
import GlobalProvider from './GlobalProvider';
// import CheckoutPageContainer from './components/CheckoutPage/CheckoutPageContainer';
// import AccountContainer from './components/Account/AccountContainer';
// import OrderDetail from './components/Account/OrderDetail';

const Home = lazy(() => import('./components/Home/Home'));
const Nav2 = lazy(() => import('./components/Nav/Nav2'));
const MobileNav = lazy(() => import('./components/Nav/MobileNav'));
// const GlobalProvider = lazy(() => import('./GlobalProvider'));
const GlobalModal = lazy(() => import('./components/provider/GlobalModal'));
const CheckoutPageContainer = lazy(() => import('./components/CheckoutPage/CheckoutPageContainer'));
const AccountContainer = lazy(() => import('./components/Account/AccountContainer'));
const OrderDetailContainer = lazy(() => import('./components/Account/OrderDetailContainer'));


const BookingForm = lazy(() => import('./components/Booking/BookingForm'));

const Signup = lazy(() => import('./components/Register/Signup'));
const CapslockProvider = lazy(() => import('./components/provider/CheckCapslock'));

const ForgotPassword = lazy(() => import('./components/Register/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Register/ResetPassword'));

const FoodPage2 = lazy(() => import('./components/OrderOnline/FoodPage2'));
const OrderOnlineContainer = lazy(() => import('./components/OrderOnline/OrderOnlineContainer'));

const Footer = lazy(() => import('./components/Home/Footer'));
const CartPage = lazy(() => import('./components/OrderOnline/CartPage/CartPage'));
const LikeItem = lazy(() => import('./components/OrderOnline/LikeItem'));
const CartPageContainer = lazy(() => import('./components/OrderOnline/CartPage/CartPageContainer'))
// const MyPage = lazy(() => import('./components/OrderOnline/MyPage'))
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
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation()
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const response = await fetch('http://localhost:5000/init', {
          method: 'GET',
          credentials: 'include' // 重要：允許設置和讀取 cookies
        });

        if (response.ok) {
          let csrf_token = Cookies.get(`X-CSRF-Token`);
          if (!csrf_token) {
            csrf_token = uuidv4();
            Cookies.set('X-CSRF-Token', csrf_token, { secure: true, sameSite: 'strict' });
          }
          setTimeout(() => {
            setIsInitialized(true);
            console.log("init");
          }, 2000);
          // setIsInitialized(true);
        }
      } catch (error) {
        console.error('App initialization failed:', error);
      }
    };

    initializeApp();
  }, []);
  useEffect(() => {
    // 這裡可以檢查使用者是否已登入，以及購物車中是否有待合併的項目
    console.log(location, "location");


  }, [location]);
  if (!isInitialized) {
    return (
      <ChakraProvider theme={theme}>
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          backgroundColor="white"
          zIndex="overlay"
          css={{
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" }
            },
            "@keyframes pulse": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" }
            },
            "@keyframes loading": {
              "0%": { width: "0%", left: "0" },
              "50%": { width: "100%", left: "0" },
              "100%": { width: "0%", left: "100%" }
            }
          }}
        >

          <Image
            src="/images/Logo.png"
            alt="Little Lemon Restaurant Logo"
            boxSize={{ base: "150px", md: "200px" }}
            objectFit="contain"
            animation="pulse 2s infinite"
            loading="eager" // 優先加載
          />
          <Box
            marginTop={8}
            width="100px"
            height="2px"
            bg="gray.100"
            borderRadius="full"
            overflow="hidden"
          >
            <Box
              width="30%"
              height="100%"
              bg="primary.500"
              animation="loading 1.5s ease-in-out infinite"
            />
          </Box>
          <Box
            as="h1"
            textStyle="StyledH1"
            marginBottom={{ base: 4, md: 6 }}
            animation="fadeIn 0.8s ease-out"
          >
            Little Lemon
          </Box>

        </Box>
      </ChakraProvider>
    );
  }
  return (
    <>
      <GlobalProvider>
        {/* <GlobalModal /> */}
        <Suspense fallback={<Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          backgroundColor="white"
          zIndex="overlay"
        ><Spinner /></Box>}>
          {/* {isInitialized && */}
          <>
            <StickyNav>
              <FullScreenSection
                backgroundColor="#ffffff"
                height={globalConfig.navHeight}
                padding="1vh 0"
                boxSizing="border-box"
              >
                <Nav2 />
                <MobileNav />
              </FullScreenSection>
            </StickyNav>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reservation" element={<BookingForm />} />
              <Route path="/order2" element={
                <FullScreenSection backgroundColor="#ffffff" height="auto">
                  {/* <OrderOnlineContainer /> */}
                  <VStack w="100%" align="start" id="menu">
                    <Box position="relative" width="100%" >
                      <OrderOnline2 />
                    </Box>
                  </VStack>
                </FullScreenSection>
              }
              />
              <Route path="/order2/:strMeal/:idMeal" element={
                <FullScreenSection backgroundColor="#ffffff" height="auto" padding="3vh 0">
                  <FoodPage2 />
                </FullScreenSection>}
              />
              <Route path="/cart" element={
                <FullScreenSection backgroundColor="#ffffff" height="100%" minHeight="67vh" padding="6vh 0">
                  <CartPageContainer />
                </FullScreenSection>}
              />
              <Route path="/checkout" element={
                <FullScreenSection backgroundColor="#ffffff" height="auto" minHeight="67vh" padding="6vh 0">
                  {/* <CheckoutPage /> */}
                  {/* <CheckoutPageSkeleton/> */}
                  <CheckoutPageContainer />
                </FullScreenSection>}
              />
              <Route path="/account" element={
                <FullScreenSection backgroundColor="#ffffff" height="auto" minHeight="67vh" padding="6vh 0">
                  {/* <MyPage /> */}
                  <AccountContainer />
                </FullScreenSection>}
              />
              <Route path="/account/order/:uuid" element={
                <FullScreenSection backgroundColor="#ffffff" height="auto" minHeight="67vh" padding="6vh 0">
                  {/* <MyPage /> */}
                  <OrderDetailContainer />
                </FullScreenSection>}
              />
              <Route path="/like" element={
                <FullScreenSection backgroundColor="#ffffff" height="auto" minHeight="67vh" padding="6vh 0">
                  {/* <LikeItem /> */}
                  {/* <LikeItemSkeleton/> */}
                  <LikeItemContainer />
                </FullScreenSection>}
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
            </Routes>
          </>
          {/* } */}
          {/* <FullScreenSection backgroundColor="#fbdabb4d" height="auto" padding="2vh 0" bottom="0">
          <Footer />
        </FullScreenSection> */}

        </Suspense>
      </GlobalProvider>

    </>
  );
}

export default App;
