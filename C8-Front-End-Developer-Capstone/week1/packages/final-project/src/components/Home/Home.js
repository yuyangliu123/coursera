import FullScreenSection from "../FullScreenSection";
import About from "./About";
// import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main/Main";
import { Box, ChakraProvider } from "@chakra-ui/react"
import theme from './../../theme';
import CustomerCard from "./CustomerSaying/CustomerCard";
import navConfig from "../Nav/config/navConfig";

const Home = () => {
  return (
    <ChakraProvider theme={theme} >
      <Box id="top">
        <FullScreenSection
          backgroundColor="#495E57"
          height={{ base: "auto", [navConfig.showNavSize]: "500px" }}
          padding={{ base: "12vh 0 4vh 0", sm: "9vh 0 4vh 0", [navConfig.showNavSize]: "7vh 0" }}
        >
          <Header />
        </FullScreenSection>
      </Box>
      <FullScreenSection backgroundColor="#FFFFFF" height="auto" padding={{ base: "0", [navConfig.showNavSize]: "3vh 0" }}>
        <Main />
      </FullScreenSection>
      <CustomerCard />
      <FullScreenSection backgroundColor="#EE9972" height="auto" padding={{ base: "2vh 0 2vh 0", xxl: "2vh 0 25vh 0" }}>
        <About />
      </FullScreenSection>
    </ChakraProvider>
  );
}

export default Home