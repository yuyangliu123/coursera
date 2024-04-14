import styled from 'styled-components';
import { Box, HStack,VStack } from "@chakra-ui/react";
import theme from "../theme.js"
import { Text } from "@chakra-ui/react";
import {Routes, Route, Link} from "react-router-dom"
const Nav = () => {
  const navElement = [
    {
      name: "HOME",
      href: "/"
    },
    {
      name: "ABOUT",
      href: "/about"
    },
    {
      name: "MENU",
      href: "/menu"
    },
    {
      name: "RESERVATIONS",
      href: "/reservation"
    },
    {
      name: "ORDER ONLINE",
      href: "/order"
    },
    {
      name: "LOGIN",
      href: "/login"
    }
  ];

  return (
    <>
    <HStack
      justifyContent="space-between"
      width="100%"
      >
      <img src="./images/Logo.svg" />
      {navElement.map((element) => {
      return <Link to={element.href}><Text textStyle="StyledNav">{element.name}</Text></Link>
      })}
    </HStack>
    </>
  );
}

export default Nav;

