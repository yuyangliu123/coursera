import { Box, Button, HStack, Image, List, ListItem, VStack ,Text, useToast} from "@chakra-ui/react";
import theme from "../../theme.js";
import { HashLink } from "react-router-hash-link";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../provider/JwtToken.js";
import { useUserRotate } from "../provider/JwtTokenRotate.js";
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
      name: "ORDER\u00A0ONLINE",
      href: "/order",
    },
    {
      name: "LOGIN",
      href: "/login",
    },
  ];
const {lname,email,availableAccessToken}=useUserRotate()
const [showLogout,setShowLogout]=useState(false)
const refreshToken= localStorage.getItem("refreshToken");
const toast = useToast()
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


const logoutRef = useRef(); // create ref

useEffect(() => {
  const handleClickOutside = (event) => {
    if (logoutRef.current && !logoutRef.current.contains(event.target)) {
      setShowLogout(false); // click outside of ref, set ShowLogout as false
    }
  }

  // add event listener when component mount
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
  // remove event listener when component mount
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  //---------------------------------------------------------------------------//
  // Now we can use fname and lname in the return statement
  return (
    <Box width="100%" display={{ base: "none", lg: "block" }}>
      <HStack justifyContent="space-between">
        <HashLink to="/#top">
          <Image src="./images/Logo.svg" />
        </HashLink>
        {navElement.map((element) => {
          if (element.name === "LOGIN" && availableAccessToken) {
            return (
              <>
              <Box height="auto" position="relative"  ref={logoutRef}>
                <Text textStyle="StyledNav"
                      onClick={() => setShowLogout(!showLogout)}
                >
                  Hi {lname}
                </Text>
                <Box
                display={showLogout?"block":"none"}
                position="absolute"
                backgroundColor="#f1f1f1"
                right="0" minWidth="100px"
                height="auto"
                onClick={() => setShowLogout(!showLogout)}
                >
                  <List>
                    <ListItem
                    onClick={()=>{
                      onLogout()
                      }}>
                      Log Out
                    </ListItem>
                  </List>
                </Box>
                </Box>
              </>
            );
          } else if(element.name === "LOGIN") {
            return (
              <>
              <Box height="auto" position="relative"  ref={logoutRef}>
                <Text textStyle="StyledNav"
                      onClick={() => setShowLogout(!showLogout)}
                >
                  LOGIN
                </Text>
                <Box
                display={showLogout?"block":"none"}
                position="absolute"
                backgroundColor="#f1f1f1"
                right="0" minWidth="100px"
                height="auto"
                onClick={() => setShowLogout(!showLogout)}
                >
                  <HashLink to="/login"><Box>Log In</Box></HashLink>
                  <HashLink to="loginrotate"><Box>Log Rotate</Box></HashLink>
                </Box>
                </Box>
              </>
            );
          }else {
            return (
              <HashLink to={element.href}>
                <Text textStyle="StyledNav">
                  {element.name}
                </Text>
              </HashLink>
            );
          }
        })}
      </HStack>
    </Box>
  );
};

export default Nav;
