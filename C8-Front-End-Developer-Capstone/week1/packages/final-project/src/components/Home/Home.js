import FullScreenSection from "../FullScreenSection";
import About from "./About";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main/Main";
import {ChakraProvider} from "@chakra-ui/react"
import theme from './../../theme';
import CustomerCard from "./CustomerSaying/CustomerCard";

const Home=()=>{
    return (
        <ChakraProvider theme={theme} >
          <FullScreenSection backgroundColor="#495E57" height="380px">
          <Header/>
          </FullScreenSection><FullScreenSection backgroundColor="#FFFFFF" height="930px">
          <Main/>
          </FullScreenSection>
          <CustomerCard/>
          <FullScreenSection backgroundColor="#EE9972" height="750px">
          <About/>
          </FullScreenSection>
          <FullScreenSection backgroundColor="#fbdabb4d" height="300px">
          <Footer/>
          </FullScreenSection>
        </ChakraProvider>
      );
}

export default Home