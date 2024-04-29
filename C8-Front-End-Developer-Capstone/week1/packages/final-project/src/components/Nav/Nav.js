import { Box, HStack, Image, VStack } from "@chakra-ui/react";
import theme from "../../theme.js";
import { Text } from "@chakra-ui/react";
import { HashLink } from "react-router-hash-link";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useToken } from "../provider/JwtToken.js";

const Nav = () => {
  const navElement = [
    {
      name: "HOME",
      href: "/#top",
    },
    {
      name: "ABOUT",
      href: "/#about",
    },
    {
      name: "MENU",
      href: "/#menu",
    },
    {
      name: "RESERVATIONS",
      href: "/reservation",
    },
    {
      name: "ORDER ONLINE",
      href: "/order",
    },
    {
      name: "LOGIN",
      href: "/login",
    },
  ];
  const result=useToken()
  const fname=useToken().fname
  const lname=useToken().lname
  const availableToken=useToken().availableToken
console.log(useToken());

  // Now we can use fname and lname in the return statement
  return (
    <Box width="100%" display={{ base: "none", lg: "block" }}>
      <HStack justifyContent="space-between">
        <HashLink to="/#top">
          <Image src="./images/Logo.svg" />
        </HashLink>
        {navElement.map((element) => {
          return (
            <HashLink to={element.href}>
              <Text textStyle="StyledNav">
              {element.name === "LOGIN" && availableToken
                  ? `Hi ${lname}`
                  : element.name}
              </Text>
            </HashLink>
          );
        })}
      </HStack>
    </Box>
  );
};

export default Nav;
