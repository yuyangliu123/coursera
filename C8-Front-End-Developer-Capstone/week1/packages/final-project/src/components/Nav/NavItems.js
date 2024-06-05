import { Box, Button, HStack, Image, List, ListItem, VStack ,Text, useToast} from "@chakra-ui/react";
//A solution to the problem of React Router being unable to scroll to #hash-fragments when navigating with the <Link> component.
import { HashLink } from "react-router-hash-link";
import { useToken } from "../provider/JwtToken";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useUserRotate } from "../provider/JwtTokenRotate";
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
    {
      name: "LOGIN",
      href: "/login"
    }
  ];
  //---------------------------------------------------------------------------//
  //If the token exists, fname and other variables will be defined;
  //otherwise (if not logged in or if the token has expired), fname will not be defined.
  const {lname,email,availableAccessToken}=useUserRotate()
  const toast=useToast()
  const refreshToken= localStorage.getItem("refreshToken");
  const onLogout = async (e) => {
    if(refreshToken){
        try {
            let result = await fetch("http://localhost:5000/logout/logout", {
              method: "post",
              body: JSON.stringify({ email: jwtDecode(refreshToken).email}),
              headers: {
                "Content-Type": "application/json"
              }
            });
            if(result.status===200){
              localStorage.removeItem("refreshToken")
              localStorage.removeItem("accessToken")
              console.log(result);
            toast({
              title:"Log Up Successfully",
              status:"success",
              duration:2000,
            })
            setTimeout(() => {
              window.location.href = "./";//After singup success, relocate to login page
            }, 2000);
            }else if (result.status === 400) {
              console.log(await result.text());
            } else {
              result = await result.json();
              console.warn(result);
            }
          } catch (error) {
            console.error("Error:", error);
          }
    }
  };
  //---------------------------------------------------------------------------//
  return (
    <>
      {navElement.map((element) => {
          if (element.name === "LOGIN" && availableAccessToken) {
            return (
              <>
                <HashLink onClick={()=>setIsOpen(false)}>
                  <Text textStyle="StyledNav">
                  Hi {lname}
                   </Text>
                </HashLink>
                <HashLink onClick={()=>{
                      onLogout()
                      setIsOpen(false)
                      }}
                  >
                  <Text textStyle="StyledNav">
                      LOG OUT
                  </Text>
                </HashLink>
              </>
            );
          } else if(element.name === "LOGIN") {
            return (
              <>
                  <HashLink
                  to="loginrotate"
                  onClick={()=>setIsOpen(false)}
                  >
                    <Text textStyle="StyledNav">
                      LOGIN
                    </Text>
                  </HashLink>
              </>
            );
          }else {
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
    </>
  );
}

export default NavItem;

