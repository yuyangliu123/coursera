import { Box, Button, HStack, Image, List, ListItem, VStack, Text, useToast } from "@chakra-ui/react";
import { HashLink } from "react-router-hash-link";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useRef, useState } from "react";
import { useUserRotate } from "../provider/JwtTokenRotate.js";
import { MealContext } from "../provider/MealContext.js"
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import client from "../provider/apollo-client.js";
import MiniCart2 from "../OrderOnline/MiniCart2.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { openDB } from 'idb';
import { axiosInstanceWithTokenCheck } from '../provider/axiosInstanceWithTokenCheck.js';
import Cookies from 'js-cookie';
import useClickOutside from "../provider/useClickOutside.js";
//If two queries have the same query name and variables, Apollo will treat them as the same query and only make one network request. 
//Then, when the result of one of the queries returns, Apollo will pass the result to all components using that query. 
//For example, the following two queries:

// const CART_ITEM_QUERY = gql`
// query Shoppingcarts($email: String) {
//   shoppingcarts(email: $email) {
//     totalItem
//   }
// }
// `

// const CART_QUERY = gql`
// query Shoppingcarts($email: String) {
//     shoppingcarts(email: $email) {
//       totalItem
//       data {
//         strMealThumb
//         strMeal
//         numMeal
//         baseAmount
//       }
//       totalAmount
//     }
//   }
// `

// This can cause query merging or query interference, which means that when querying CART_ITEM_QUERY, 
// it may also return the result of CART_QUERY.

const CART_ITEM_QUERY = gql`
query Cartitemnumber($email: String) {
  cartitemnumber(email: $email) {
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
// init IndexedDB
const initDB = async () => {
  const db = await openDB('meal-database', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: 'idMeal' });
      }
    },
  });
  return db;
};


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
      name: "Like",
      href: "",
    },
    {
      name: "LOGIN",
      href: "/login",
    },
  ];

  const { cartItem, setCartItem, cartItemChangedRef } = useContext(MealContext);
  const { lname, email, availableAccessToken, accessToken, isUser } = useUserRotate();

  const { data: item, loading: loading1, error: error1 } = useQuery(CART_ITEM_QUERY, {
    variables: { email },
    fetchPolicy: 'cache-and-network',
    skip: !email,
    //set cart icon number when login
    onCompleted: (data) => {
      setCartItem(data.cartitemnumber[0].totalItem);
    },
    onError: (error) => {
      console.log(error);
    }
  });
  const [showLogout, setShowLogout] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const toast = useToast();

  //Apollo Client executes the full query against your GraphQL server, without first checking the cache.
  //The query's result is stored in the cache.
  const [fetchCart, { data: cart, loading, error }] = useLazyQuery(CART_QUERY, {
    fetchPolicy: 'cache-and-network',
    skip: !email || !cartItem || cartItem <= 0
  });




  //------------------------------------------------------------------
  //load indexedDB data
  const [cartDB, setCartDB] = useState(null)
  const loadCart = async () => {
    const db = await initDB();
    let existingCart = await db.get('cart', 'cartData');
    if (existingCart) {
      setCartDB(existingCart)
    }
  };








  //set cart icon number when not login
  useEffect(() => {
    if (isUser === false) {
      const loadLikeData = async () => {
        const db = await initDB();
        let existingCart = await db.get('cart', 'cartData');
        if (existingCart) {
          setCartItem(existingCart.totalItem)
        }
      };
      loadLikeData();
    }
  }, [isUser]);
  //------------------------------------------------------------------





  //----------------do not edit-----------------------


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
        } else if (error.response && error.response.status === 400) {
          console.log(error.response);
        } else {
          console.error("Error:", error);
        }
      }
    }
  };


  //click outside and hide relative div
  const logoutRef = useRef();
  const minicartRef = useRef();

  useClickOutside([logoutRef, minicartRef], () => {
    setShowLogout(false)
    setShowMiniCart(false)
  })
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
            if (loading1) {
              return (
                <Box>
                  <Image src="/images/Basket.svg" />
                </Box>
              )
            }
            if (error1) {
              console.error('CART_ITEM_QUERY error', error1);
              return <p>Error!</p>;
            }

            return (
              <Box
                position="relative"
                onClick={() => {
                  setShowMiniCart(!showMiniCart);
                  if (cartItemChangedRef.current) {
                    //load cart data
                    isUser ? fetchCart({ variables: { email } }) : loadCart()
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
                {showMiniCart ? (
                  <MiniCart2
                    cart={isUser && cart && cart.shoppingcarts && cart.shoppingcarts.length > 0 ? cart.shoppingcarts[0] : cartDB || null}
                    showMiniCart={showMiniCart}
                    setShowMiniCart={setShowMiniCart}
                  />
                ) : null}
              </Box>
            );
          } else if (element.name === "LOGIN") {
            return (
              <>
                <HashLink
                  to="loginrotate"
                >
                  <Text textStyle="StyledNav">
                    LOGIN
                  </Text>
                </HashLink>
              </>
            );
          } else if (element.name === "Like") {
            return (
              <HashLink to="/like">
                <FontAwesomeIcon
                  icon={faHeart}
                  size="2xl"
                  color="#ff0000"
                />
              </HashLink>
            )
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
