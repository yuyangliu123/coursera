import { Box, Button, HStack, Image, List, ListItem, VStack ,Text, useToast} from "@chakra-ui/react";
import theme from "../../theme.js";
import { HashLink } from "react-router-hash-link";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useRef, useState } from "react";
import { useUser } from "../provider/JwtToken.js";
import { useUserRotate } from "../provider/JwtTokenRotate.js";
import {MealContext} from "../provider/MealContext"
import MiniCart from "../OrderOnline/MiniCart.js";
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
      name: "Cart",
      href: "",
    },
    {
      name: "LOGIN",
      href: "/login",
    },
  ];
const {lname,email,availableAccessToken,accessToken}=useUserRotate()
const [showLogout,setShowLogout]=useState(false)
const [showMiniCart,setShowMiniCart]=useState(false)
const toast = useToast()
const { cartItem,setCartItem } = useContext(MealContext);
const [cart,setCart]=useState({})
const onLogout = async (e) => {
  if(accessToken){
      try {
          let result = await fetch("http://localhost:5000/logout/logout", {
            method: "post",
            body: JSON.stringify({ email: jwtDecode(accessToken).email}),
            headers: {
              "Content-Type": "application/json"
            }
          });
          if(result.status===200){
            localStorage.removeItem("accessToken")
            console.log(result);
            toast({
              title:"Logged Out Successfully",
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


const logoutRef = useRef(); // create logout ref
const minicartRef=useRef()
useEffect(() => {
  const handleClickOutside = (event) => {
    if (logoutRef.current && !logoutRef.current.contains(event.target)) {
      setShowLogout(false); // click outside of ref, set ShowLogout as false
    }
    if (minicartRef.current && !minicartRef.current.contains(event.target)) {
      setShowMiniCart(false); // click outside of ref, set ShowLogout as false
    }
  }

  // add event listener when component mount
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
  // remove event listener when component mount
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


useEffect(()=>{
  (async()=>{
      if(email && email!==""){
          try{
              await fetch(`http://localhost:5000/api/carts`, {
                  method: "post",
                  body: JSON.stringify({
                      email:email?email:"",
                  }),
                  headers: {
                    "Content-Type": "application/json"
                  }
                })
              .then(response=>response.json())
              .then(data=>{
                  const totalNum=data.shoppingcart.data.reduce((total, item) => total + item.numMeal, 0)
                  setCartItem(totalNum)
                  setCart(prevCart => ({...prevCart, ...data}))
              })
          }catch(err){
              console.log(err);
          }
      }
  })()
},[email,cartItem])


  //---------------------------------------------------------------------------//
  // Now we can use fname and lname in the return statement
  return (
    <Box width="100%" display={{ base: "none", lg: "block" }}>
      <HStack justifyContent="space-between">
        <HashLink to="/#top">
          <Image src="/images/Logo.svg" />
        </HashLink>
        {navElement.map((element) => {
          if (element.name === "LOGIN" && availableAccessToken) {
            return (
                <Box height="auto" position="relative"  ref={logoutRef}>
                  <Text textStyle="StyledNav"
                        onClick={() => setShowLogout(!showLogout)}
                  >
                    Hi {lname}
                  </Text>
                  <Box
                  display={showLogout?"block":"none"}
                  position="absolute"
                  backgroundColor="#fff"
                  right="0"
                  minWidth="150px"
                  height="auto"
                  border="1px solid #ccc"
                  onClick={() => setShowLogout(!showLogout)}
                  >
                    <List>
                      <ListItem
                      onClick={()=>{
                        onLogout()
                        }}>
                          <Box  textStyle="StyledNav" marginLeft="1rem">
                            Log Out
                          </Box>
                      </ListItem>
                    </List>
                  </Box>
                </Box>
            );
          }else if(element.name === "Cart"){
            return(
              <>
              {(Object.keys(cart).length==0) &&
              <Box>
              <Image src="/images/Basket.svg"/>
              </Box>
              }
              {(Object.keys(cart).length>0) &&
              <Box
              position="relative"
              onClick={()=>setShowMiniCart(!showMiniCart)}
              ref={minicartRef}
              >
                <Box
                position="absolute"
                display="inline-flex"
                right="-0.5rem"
                top="0.3rem"
                zIndex="100"
                backgroundColor="red"
                color="white"
                borderRadius="50%"
                height="1rem"
                width="1rem"
                alignItems="center"
                justifyContent="center">{cartItem}</Box>
                <Box>
                <Image src="/images/Basket.svg"/>
                </Box>
                <MiniCart cart={cart} showMiniCart={showMiniCart} setShowMiniCart={setShowMiniCart}/>
              </Box>
              }
              </>

            )
          }
          else if(element.name === "LOGIN") {
            return (
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
