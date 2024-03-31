import React from "react"
import {Routes, Route, Link} from "react-router-dom"
import { createGlobalStyle } from 'styled-components';
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactMeSection from "./components/ContactMeSection";
import ContactMeSection1 from "./components/ContactMeSection1";
import { AlertProvider } from "./components/alertContext";
import CreateaRegistrationForm from "./components/CreateaRegistrationForm";
import Alert from "./components/Alert";
import ContactMeSection2 from "./components/ContactMeSection2";
import { ChakraProvider } from "@chakra-ui/react";


const GlobalStyle=createGlobalStyle`
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

nav a{
  margin: 1em;
}
`


function App() {

  return (
    <>
    <ChakraProvider>
    <AlertProvider>
      <Header/>
      <LandingSection/>
      <ProjectsSection/>
      <ContactMeSection/>
      <ContactMeSection1/>
      <ContactMeSection2/>
      <Alert/>
    </AlertProvider>
    </ChakraProvider>
    
    
    </>
  );
}

export default App;
