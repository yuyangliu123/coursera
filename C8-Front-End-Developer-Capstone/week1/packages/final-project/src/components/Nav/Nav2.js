import { Box, Button, HStack, Image, List, ListItem, VStack, Text, useToast } from "@chakra-ui/react";
import { HashLink } from "react-router-hash-link";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useRef, useState } from "react";
import { useUser } from "../provider/JwtToken.js";
import { useUserRotate } from "../provider/JwtTokenRotate.js";
import { MealContext } from "../provider/MealContext.js"
import MiniCart from "../OrderOnline/MiniCart.js";
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import MiniCart2 from "../OrderOnline/MiniCart2.js";
const CART_ITEM_QUERY = gql`
query Shoppingcarts($email: String) {
    shoppingcarts(email: $email) {
      totalItem
    }
  }
`
const CART_QUERY = gql`
query Shoppingcarts($email: String) {
    shoppingcarts(email: $email) {
      totalItem
      data {
        strMealThumb
        strMeal
        numMeal
        baseAmount
      }
      totalAmount
    }
  }
`

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
    {
      name: "RESERVATIONS",
      href: "/reservation",
    },
    {
      name: "ORDER\u00A0ONLINE",
      href: "/order2",
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

  const { lname, email, availableAccessToken } = useUserRotate();
  const { data: item, loading: loading1, error: error1 } = useQuery(CART_ITEM_QUERY, { variables: { email } });
  const [showLogout, setShowLogout] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);

  //Apollo Client executes the full query against your GraphQL server, without first checking the cache.
  //The query's result is stored in the cache.
  const [fetchCart, { data: cart, loading, error }] = useLazyQuery(CART_QUERY,
                                                                  {fetchPolicy: 'network-only',});
  const refreshToken = localStorage.getItem("refreshToken");
  const toast = useToast();
  const { cartItem, setCartItem } = useContext(MealContext);



  // Use a ref to track if cartItem has changed
  const cartItemChangedRef = useRef(false);

  //set cart icon number
  useEffect(() => {
    if (email && email !== "" && item && item.shoppingcarts.length > 0) {
      setCartItem(item.shoppingcarts[0].totalItem);
    }
  }, [email, item]);
  
  //if cartItem change, set cartItem Ref to true
    useEffect(() => {
    if (cartItem !== undefined) {
      cartItemChangedRef.current = true;
    }
  }, [cartItem]);


  //----------------do not edit-----------------------
  const onLogout = async (e) => {
    if (refreshToken) {
      try {
        let result = await fetch("http://localhost:5000/logout/logout", {
          method: "post",
          body: JSON.stringify({ email: jwtDecode(refreshToken).email }),
          headers: { "Content-Type": "application/json" }
        });
        if (result.status === 200) {
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          toast({ title: "Logged Out Successfully", status: "success", duration: 2000 });
          setTimeout(() => {
            window.location.href = "./";
          }, 2000);
        } else if (result.status === 400) {
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

  const logoutRef = useRef(); 
  const minicartRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setShowLogout(false); 
      }
      if (minicartRef.current && !minicartRef.current.contains(event.target)) {
        setShowMiniCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
//----------------do not edit-----------------------
  return (
    <Box width="100%" display={{ base: "none", lg: "block" }}>
      <HStack justifyContent="space-between">
        <HashLink to="/#top">
          <Image src="/images/Logo.svg" />
        </HashLink>
        {navElement.map((element) => {
          if (element.name === "LOGIN" && availableAccessToken) {
            return (
              <Box height="auto" position="relative" ref={logoutRef} key={element.name}>
                <Text textStyle="StyledNav" onClick={() => setShowLogout(!showLogout)}>
                  Hi {lname}
                </Text>
                <Box
                  display={showLogout ? "block" : "none"}
                  position="absolute"
                  backgroundColor="#fff"
                  right="0"
                  minWidth="150px"
                  height="auto"
                  border="1px solid #ccc"
                  onClick={() => setShowLogout(!showLogout)}
                >
                  <List>
                    <ListItem onClick={onLogout}>
                      <Box textStyle="StyledNav" marginLeft="1rem">Log Out</Box>
                    </ListItem>
                  </List>
                </Box>
              </Box>
            );
          } else if (element.name === "Cart") {
            if (loading1){
              return(
                <Box>
                  <Image src="/images/Basket.svg" />
                </Box>
            ) }
            if (error1) {
              console.error('CART_ITEM_QUERY error', error1);
              return <p>Error!</p>;
            }

            if (!item || !item.shoppingcarts || !item.shoppingcarts[0]){
              return(
                <Box
                position="relative"
                onClick={() => {
                  setShowMiniCart(!showMiniCart);
                  if (cartItemChangedRef.current) {
                    fetchCart({ variables: { email } });
                    cartItemChangedRef.current = false; // reset the flag
                  }
                }}
                ref={minicartRef}
                key={element.name}
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
                  justifyContent="center"
                >
                  {cartItem}
                </Box>
                <Box>
                  <Image src="/images/Basket.svg" />
                </Box>
                {showMiniCart &&  (
                  <Box
                  display={showMiniCart?"block":"none"}
                  position="absolute"
                  backgroundColor="#fff"
                  right="0"
                  minWidth="200px"
                  maxHeight="500px"
                  border="1px solid #ccc"
                  onClick={()=>setShowMiniCart(!showMiniCart)}
                  >
                    No Item In Cart
                  </Box>
                  )}
              </Box>
            )
            }
            return (
              <Box
                position="relative"
                onClick={() => {
                  setShowMiniCart(!showMiniCart);
                  //click and set cartItem ref to false, prevent refetch when cartItem not change
                  if (cartItemChangedRef.current) {
                    fetchCart({ variables: { email } });
                    cartItemChangedRef.current = false; // reset the flag
                  }
                }}
                ref={minicartRef}
                key={element.name}
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
                  justifyContent="center"
                >
                  {cartItem}
                </Box>
                <Box>
                  <Image src="/images/Basket.svg" />
                </Box>
                {showMiniCart && cart && cart.shoppingcarts && (
                  <MiniCart2 cart={cart.shoppingcarts[0]} showMiniCart={showMiniCart} setShowMiniCart={setShowMiniCart} />
                )}
              </Box>
            );
          }else if(element.name === "LOGIN") {
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
          } else {
            return (
              <HashLink to={element.href} key={element.name}>
                <Text textStyle="StyledNav">{element.name}</Text>
              </HashLink>
            );
          }
        })}
      </HStack>
    </Box>
  );
};

export default Nav2;
