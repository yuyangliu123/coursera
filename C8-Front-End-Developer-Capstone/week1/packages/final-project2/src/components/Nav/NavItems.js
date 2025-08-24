import { Box, Button, HStack, Image, List, ListItem, VStack ,Text, useToast} from "@chakra-ui/react";
//A solution to the problem of React Router being unable to scroll to #hash-fragments when navigating with the <Link> component.
import { HashLink } from "react-router-hash-link";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useUserRotate } from "../provider/JwtTokenRotate";

import {axiosInstance, axiosInstanceWithTokenCheck} from '../provider/axiosInstanceWithTokenCheck';
import Cookies from 'js-cookie';
import NavLogin from "./NavLogin";
const NavItem = ({ setIsOpen}) => {
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
    {
      name: "RESERVATIONS",
      href: "/reservation"
    },
    {
      name: "ORDER ONLINE",
      href: "/order2"
    },
    // {
    //   name: "LOGIN",
    //   href: "/login"
    // }
  ];
  //---------------------------------------------------------------------------//
  //If the token exists, fname and other variables will be defined;
  //otherwise (if not logged in or if the token has expired), fname will not be defined.
  const {lname,email,availableAccessToken,accessToken}=useUserRotate()
  const toast=useToast()
  
  const onLogout = async (e) => {
    if (accessToken) {
      try {
        let result = await (await axiosInstanceWithTokenCheck()).post("http://localhost:5000/logout/logout");
        if (result.status === 200) {
          localStorage.removeItem("accessToken");
          Cookies.remove('X-CSRF-Token');
          toast({ title: "Logged Out Successfully", status: "success", duration: 2000 });
          setTimeout(() => {
            window.location.href = "./";
          }, 2000);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("accessToken");
          Cookies.remove('X-CSRF-Token');
          console.log("Unauthorized - Logged Out");
        }else if (error.response && error.response.status === 400) {
          console.log(error.response);
        } else {
          console.error("Error:", error);
        }
      }
    }
  };
  //---------------------------------------------------------------------------//
  return (
    <>
      {navElement.map((element) => {
          // if (element.name === "LOGIN" && availableAccessToken) {
          //   return (
          //     <>
          //       <HashLink onClick={()=>setIsOpen(false)}>
          //         <Text textStyle="StyledNav">
          //         Hi {lname}
          //          </Text>
          //       </HashLink>
          //       <HashLink onClick={()=>{
          //             onLogout()
          //             setIsOpen(false)
          //             }}
          //         >
          //         <Text textStyle="StyledNav">
          //             LOG OUT
          //         </Text>
          //       </HashLink>
          //     </>
          //   );
          // } else if(element.name === "LOGIN") {
          //   return (
          //     <>
          //         <HashLink
          //         to="loginrotate"
          //         onClick={()=>setIsOpen(false)}
          //         >
          //           <Text textStyle="StyledNav">
          //             LOGIN
          //           </Text>
          //         </HashLink>
          //     </>
          //   );
          // }else 
          {
            return (
              <HashLink
              to={element.href}
              onClick={()=>setIsOpen(false)}
              >
                <Text textStyle="StyledNav">
                  {element.name}
                </Text>
              </HashLink>
            );
          }
          
        })}
        <NavLogin/>
    </>
  );
}

export default NavItem;

