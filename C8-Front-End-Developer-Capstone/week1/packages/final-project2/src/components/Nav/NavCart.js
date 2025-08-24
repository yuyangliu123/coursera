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



const NavCart = ({ showcart = true, ...prop }) => {

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
    const [showMiniCart, setShowMiniCart] = useState(false);
    //Apollo Client executes the full query against your GraphQL server, without first checking the cache.
    //The query's result is stored in the cache.
    const [fetchCart, { data: cart, loading, error }] = useLazyQuery(CART_QUERY, {
        fetchPolicy: 'cache-and-network',
        skip: !email || !cartItem || cartItem <= 0 || !showcart
    });
    //------------------------------------------------------------------
    //load indexedDB data
    const [cartDB, setCartDB] = useState(null)
    const loadCart = async () => {
        if (!showcart) return;
        const db = await initDB();
        let existingCart = await db.get('cart', 'cartData');
        if (existingCart) {
            setCartDB(existingCart)
        }
    };



    //set cart icon number when not login
    useEffect(() => {
        if (isUser === false && showcart) {
            const loadLikeData = async () => {
                const db = await initDB();
                let existingCart = await db.get('cart', 'cartData');
                if (existingCart) {
                    setCartItem(existingCart.totalItem)
                }
            };
            loadLikeData();
        }
    }, [isUser, showcart]);

    const minicartRef = useRef();
    useClickOutside([minicartRef], () => {
        setShowMiniCart(false)
    })


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
        <>
            {showcart ?
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
                    key="Cart"
                    {...prop}
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
                </Box> :
                <HashLink to="/cart">
                    <Box
                        position="relative"
                        key="Cart"
                        {...prop}
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
                    </Box>
                </HashLink>
            }
        </>
    )





}

export default NavCart