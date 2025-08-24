import { Box, Button, HStack, Image, List, ListItem, VStack, Text, useToast } from "@chakra-ui/react";
//A solution to the problem of React Router being unable to scroll to #hash-fragments when navigating with the <Link> component.
import { HashLink } from "react-router-hash-link";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useUserRotate } from "../provider/JwtTokenRotate";

import { apiClient } from '../provider/axiosInstanceWithTokenCheck';
import Cookies from 'js-cookie';
import NavLogin from "./NavLogin";
import NavReserve from "./NavReserve";
import { backToTop } from "../provider/backToTop";
import SubFooter from "../Home/SubFooter";

const NavItem = ({ setIsOpen }) => {
  const navElement = [
    {
      name: "HOME",
      href: "/#top"
    },
    {
      name: "ABOUT",
      href: "/#about"
    },
    {
      name: "MENU",
      href: "/#menu"
    },
    // {
    //   name: "ORDER ONLINE",
    //   href: "/order2"
    // },
    // {
    //   name: "RESERVATIONS",
    //   href: "/reservation"
    // },

    // {
    //   name: "LOGIN",
    //   href: "/login"
    // }
  ];
  const orderElement = [
    {
      name: "ORDER\u00A0ONLINE",
      href: "/order2",
    },
  ];
  //---------------------------------------------------------------------------//
  //If the token exists, fname and other variables will be defined;
  //otherwise (if not logged in or if the token has expired), fname will not be defined.
  const { lname, email, availableAccessToken, accessToken } = useUserRotate()
  // const toast = useToast()

  // const onLogout = async (e) => {
  //   if (accessToken) {
  //     try {
  //       let result = await apiClient.post("http://localhost:5000/logout/logout");
  //       if (result.status === 200) {
  //         localStorage.removeItem("accessToken");
  //         Cookies.remove('X-CSRF-Token');
  //         toast({ title: "Logged Out Successfully", status: "success", duration: 2000 });
  //         setTimeout(() => {
  //           window.location.href = "./";
  //         }, 2000);
  //       }
  //     } catch (error) {
  //       if (error.response && error.response.status === 401) {
  //         localStorage.removeItem("accessToken");
  //         Cookies.remove('X-CSRF-Token');
  //         console.log("Unauthorized - Logged Out");
  //       } else if (error.response && error.response.status === 400) {
  //         console.log(error.response);
  //       } else {
  //         console.error("Error:", error);
  //       }
  //     }
  //   }
  // };
  //---------------------------------------------------------------------------//
  return (
    <>

      <VStack>
        {navElement.map((element) => {
          {
            return (
              <HashLink
                to={element.href}
                onClick={() => setIsOpen(false)}
              >
                <Text textStyle="StyledNav">
                  {element.name}
                </Text>
              </HashLink>
            );
          }
        })}
        {orderElement.map((element) => {
          return (
            <HashLink
              to={element.href}
              key={element.name}
              onClick={() => {
                setIsOpen(false)
                // requestAnimationFrame(() => {
                //   window.scrollTo({ top: 0 });
                // })
                backToTop()
              }}>
              <Text textStyle="StyledNav">{element.name}</Text>
            </HashLink>
          )
        })}
        <Box onClick={() => setIsOpen(false)}>
          <NavReserve />
        </Box>
        <Box>
          <NavLogin setIsOpen={setIsOpen} />
        </Box>
        <Box>
          <SubFooter />
        </Box>
      </VStack>
    </>
  );
}

export default NavItem;

