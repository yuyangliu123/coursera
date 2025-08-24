import { Box, HStack, VStack, Button, Image } from "@chakra-ui/react";
import theme from "../../theme"
//A solution to the problem of React Router being unable to scroll to #hash-fragments when navigating with the <Link> component.
import { HashLink } from "react-router-hash-link";
import NavItem from './NavItems';
import { lazy, useEffect, useRef, useState } from 'react';
import { HamburgerIcon, SmallCloseIcon } from '@chakra-ui/icons';
const NavCart = lazy(() => import('./NavCart.js'));
// import NavCart from "./NavCart";
import NavLike from "./NavLike";
import NavLogin from "./NavLogin";
import useClickOutside from "../provider/useClickOutside";
const MobileNav = () => {
  //--------------------------------------------------------------------------------//
  //Set mobile menu toggle function
  const [isOpen, setIsOpen] = useState(false)
  //--------------------------------------------------------------------------------//
  //--------------------------------------------------------------------------------//
  //Click outside of mobile nav, then nav will colose
  const navRef = useRef()
  useClickOutside([navRef], () => {
    setIsOpen(false)
  })
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (navRef.current && !navRef.current.contains(e.target)) {
  //       setIsOpen(false)
  //     }
  //   }
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [])
  //--------------------------------------------------------------------------------//
  return (
    <>
      <Box
        display={{ lg: "none", base: "block" }}
        width="100%"
      >
        <HStack
          justifyContent="space-between"
        >
          <HashLink to="/#top"><Image src="/images/LogoIcon_24x40.svg" /></HashLink>
          <HStack
            width="auto"
            justifyContent="space-between"
          >
            <NavCart showcart={false} margin="0 2vh" />
            <NavLike />
            {/* <NavLogin/> */}

            <Button backgroundColor="#FFFFFF" onClick={() => setIsOpen(!isOpen)}><HamburgerIcon /></Button>
          </HStack>
        </HStack>
        <VStack
          height="100vh"
          width={isOpen ? "250px" : "0px"} //if click hamburger icon, then menu witdth change from 0 to 250px
          position="fixed"
          zIndex="100"
          top="0"
          right="0"
          backgroundColor="#ffffff"
          overflowX="hidden"
          paddingTop="50px"
          transition="0.5s"
          ref={navRef}
        >
          <Button
            onClick={() => setIsOpen(!isOpen)}
            backgroundColor="#ffffff"
            position="absolute"
            top="10px"
            left="25px"><SmallCloseIcon /></Button>
          <NavItem setIsOpen={setIsOpen} />
        </VStack>
      </Box>
    </>
  )
}

export default MobileNav