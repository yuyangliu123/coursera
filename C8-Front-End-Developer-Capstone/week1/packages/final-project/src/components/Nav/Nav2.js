import { Box, Button, HStack, Image, List, ListItem, VStack, Text, useToast } from "@chakra-ui/react";
import { HashLink } from "react-router-hash-link";
import { jwtDecode } from "jwt-decode";
import { lazy, Suspense, useContext, useEffect, useRef, useState } from "react";
import { useUserRotate } from "../provider/JwtTokenRotate.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { openDB } from 'idb';
import { apiClient } from '../provider/axiosInstanceWithTokenCheck.js';
import Cookies from 'js-cookie';
import useClickOutside from "../provider/useClickOutside.js";
// const NavCart = lazy(() => import('./NavCart.js'));

import NavCart from "./NavCart.js";
import NavLike from "./NavLike.js";
import NavLogin from "./NavLogin.js";
import NavReserve from "./NavReserve.js";
import { backToTop } from "../provider/backToTop.js";
import SubFooterContainer from "../Home/SubFooterContainer.js";
import navConfig from "./config/navConfig.js";
//If two queries have the same query name and variables, Apollo will treat them as the same query and only make one network request. 
//Then, when the result of one of the queries returns, Apollo will pass the result to all components using that query. 
//For example, the following two queries:


// This can cause query merging or query interference, which means that when querying CART_ITEM_QUERY, 
// it may also return the result of CART_QUERY.

const Nav2 = () => {
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
    // {
    //   name: "RESERVATIONS",
    //   href: "/reservation",
    // },
    // {
    //   name: "ORDER\u00A0ONLINE",
    //   href: "/order2",
    // },
    // {
    //   name: "Like",
    //   href: "",
    // },
    // {
    //   name: "LOGIN",
    //   href: "/login",
    // },
  ];
  const orderElement = [
    {
      name: "ORDER\u00A0ONLINE",
      href: "/order2",
    },
  ];

  // const [showLogout, setShowLogout] = useState(false);
  const toast = useToast();
  const { lname, email, availableAccessToken, accessToken, isEmail } = useUserRotate();










  //----------------do not edit-----------------------


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


  // //click outside and hide relative div
  // const logoutRef = useRef();

  // useClickOutside([logoutRef], () => {
  //   setShowLogout(false)
  // })
  //----------------do not edit-----------------------

  return (
    // <Suspense fallback={<Box>loading</Box>}>
    <Box
      width="100%"
      display={{ base: "none", [navConfig.showNavSize]: "block" }}
      id="2layer"
    >
      <HStack justifyContent="space-between" id="1layer">
        <HashLink to="/#top">
          <Image src="/images/Logo.svg" />
        </HashLink>
        {navElement.map((element) => {
          {
            return (
              <HashLink to={element.href} key={element.name}>
                <Text textStyle="StyledNav">{element.name}</Text>
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
                backToTop()
              }}>
              <Text textStyle="StyledNav">{element.name}</Text>
            </HashLink>
          )
        })}
        {/* <HashLink to="/order2" key="ORDER\u00A0ONLINE">
          <Text textStyle="StyledNav">`ORDER\u00A0ONLINE`</Text>

          </HashLink> */}
        <NavReserve />
        <NavCart />
        <NavLike />


        <NavLogin />
        <SubFooterContainer />
      </HStack>
    </Box>
    // </Suspense>
  );
};

export default Nav2;
