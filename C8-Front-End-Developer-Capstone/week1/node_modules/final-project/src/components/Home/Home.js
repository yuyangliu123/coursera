import FullScreenSection from "../FullScreenSection";
import About from "./About";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main/Main";
import {Box, ChakraProvider} from "@chakra-ui/react"
import theme from './../../theme';
import CustomerCard from "./CustomerSaying/CustomerCard";

const Home=()=>{
    return (
        <ChakraProvider theme={theme} >
          <Box id="top">
            <FullScreenSection backgroundColor="#495E57" height={{base:"auto",lg:"500px"}} padding={{base:"9vh 0 4vh 0",lg:"7vh 0"}}>
              <Header/>
            </FullScreenSection>
          </Box>
          <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding="3vh 0">
            <Main/>
          </FullScreenSection>
          <CustomerCard/>
          <FullScreenSection backgroundColor="#EE9972" height="auto" padding={{base:"2vh 0 2vh 0",xxl:"2vh 0 20vh 0"}}>
            <About/>
          </FullScreenSection>
          <FullScreenSection backgroundColor="#fbdabb4d" height="auto" padding="2vh 0">
            <Footer/>
          </FullScreenSection>
        </ChakraProvider>
      );
}

export default Home