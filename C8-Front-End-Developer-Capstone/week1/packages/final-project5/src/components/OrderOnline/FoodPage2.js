import { Box, Button, HStack, Image, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MealContext } from "../provider/MealContext";
import { useUserRotate } from "../provider/JwtTokenRotate";
import { gql, useQuery } from '@apollo/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farFaHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { openDB } from 'idb';
import { axiosInstance } from '../provider/axiosInstanceWithTokenCheck';
import Cookies from 'js-cookie';
import { axiosInstanceWithTokenCheck } from "../provider/axiosInstanceWithTokenCheck";
import LazyLoadImage from "../provider/LazyLoadImage";

const LIKE_QUERY = gql`
query Likeitemnumber($email: String!) {
  likeitemnumber(email: $email) {
    likeItem {
      strMeal
    }
  }
}
`;

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

const updateDB = async (newData) => {
    const db = await initDB();
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');
    await store.put(newData);
    await tx.done;
};

const FoodPage2 = () => {
    const [data, setData] = useState();
    const { strMeal } = useParams();
    const decodedMeal = decodeURIComponent(strMeal);
    const [numMeal, setNumMeal] = useState(1);
    const [price, setPrice] = useState();
    const { cartItem, setCartItem } = useContext(MealContext);
    const { email, isUser, accessToken } = useUserRotate();
    const [isLike, setIsLike] = useState(false);

    const { loading, error, data: likeData, refetch } = useQuery(LIKE_QUERY,
        {
            variables: { email },
            fetchPolicy: 'network-only',
            //if user not login, then useQuery would not be trigger
            skip: !email,
            onCompleted: (data) => {
                const likeItem = data.likeitemnumber.flatMap(cart => cart.likeItem);
                const isLiked = likeItem.some(item => item.strMeal === decodedMeal);
                setIsLike(isLiked);
            },
            onError: (error) => {
                console.log(error);
            }
        });



    // load isLiked state when not login
    useEffect(() => {
        if (!isUser) {
            const loadLikeData = async () => {
                const db = await initDB();
                let existingCart = await db.get('cart', 'cartData');
                if (existingCart && existingCart.likeItem) {
                    const isLiked = existingCart.likeItem.some(item => item.strMeal === decodedMeal);
                    setIsLike(isLiked);
                }
            };
            loadLikeData();
        }
    }, [decodedMeal, isUser]);

    //load meal info
    useEffect(() => {
        (async () => {
            if (decodedMeal) {
                await fetch(`http://localhost:5000/api/foodPage/${decodedMeal}`)
                    .then(response => response.json())
                    .then(data => {
                        setData(prevMeal => ({ ...prevMeal, ...data }));
                        setPrice(data.price);
                    })
                    .catch(err => console.log(err));
            }
        })();
    }, [strMeal]);

    const handleLike = async () => {
        const newIsLike = !isLike;

        const newLikeItem = {
            strMeal: data.strMeal,
            idMeal: data.idMeal,
            baseAmount: data.price,
            strMealThumb: data.strMealThumb,
            _id: data.idMeal
        };
        //if user not login, then handleLike would not be trigger
        if (!isUser) {
            console.log("User is not logged in. Saving order locally.");

            // save to indexedDB
            const db = await initDB();
            let existingCart = await db.get('cart', 'cartData');

            if (existingCart) {
                if (newIsLike === true) {
                    existingCart.likeItem.push(newLikeItem);
                } else {
                    existingCart.likeItem = existingCart.likeItem.filter(item => item.idMeal !== newLikeItem.idMeal)
                }
            } else {
                // Create new cart data
                existingCart = {
                    isUser: isUser,
                    totalAmount: price,
                    totalItem: numMeal,
                    data: [],
                    likeItem: [newLikeItem]
                };
            }

            await updateDB(Object.assign(existingCart, { idMeal: 'cartData' }));
            setIsLike(newIsLike)
            return;
        }


        try {
            let result = await (await axiosInstanceWithTokenCheck()).post("http://localhost:5000/api/update",
                {
                    event: "like",
                    likeState: newIsLike ? "like" : "none",
                    meal: data.strMeal,
                    idMeal: data.idMeal,
                    price: data.price,
                    strMealThumb: data.strMealThumb,
                });
            if (result.status === 200) {
                setIsLike(newIsLike);
                refetch();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onOrder = async () => {
        const orderData = {
            meal: data.strMeal,
            numMeal: numMeal,
            idMeal: data.idMeal,
            price: price,
            strMealThumb: data.strMealThumb
        };
        const newOrderItem = {
            strMeal: data.strMeal,
            numMeal: numMeal,
            idMeal: data.idMeal,
            baseAmount: data.price,
            cartAmount: price,
            strMealThumb: data.strMealThumb,
            _id: data.idMeal // assuming idMeal is unique and used as the key
        };


        if (!isUser) {
            console.log("User is not logged in. Saving order locally.");

            // save data to IndexedDB
            const db = await initDB();
            let existingCart = await db.get('cart', 'cartData');

            if (existingCart) {
                // Update existing cart data
                existingCart.totalAmount += price;
                existingCart.totalAmount = parseFloat(existingCart.totalAmount.toFixed(2))
                existingCart.totalItem += numMeal;

                const existingItemIndex = existingCart.data.findIndex(item => item.idMeal === newOrderItem.idMeal);
                if (existingItemIndex !== -1) {
                    existingCart.data[existingItemIndex].numMeal += numMeal;
                    existingCart.data[existingItemIndex].cartAmount += price;
                } else {
                    existingCart.data.push(newOrderItem);
                }
            } else {
                // Create new cart data
                existingCart = {
                    isUser: isUser,
                    totalAmount: price,
                    totalItem: numMeal,
                    data: [newOrderItem],
                    likeItem: []
                };
            }

            await updateDB(Object.assign(existingCart, { idMeal: 'cartData' }));
            setCartItem(currentCartItem => currentCartItem + numMeal);
            return;
        } else {
            try {
                let result = await (await axiosInstanceWithTokenCheck()).post("http://localhost:5000/api/addToCart", orderData);
                if (result.status === 200) {
                    setCartItem(currentCartItem => currentCartItem + numMeal);
                }
            } catch (err) {
                console.log(err);
            }

        }
    };

    if (loading){
        return (
            <>
                <VStack w="100%" align="start" padding="100px 0" id="menu">
                    <Stack w="100%" justifyContent={{ base: "none", lg: "space-between" }} marginBottom="50px" direction={{ base: "column", lg: "row" }}>
                        <VStack width={{ base: "100%", lg: "50%" }}>
                        <Skeleton width="50%" height="30px" />
                            <Skeleton width="100%" height="600px" />

                            <HStack width={{md:"50%",base:"80%"}}>
                                <Button>-</Button>
                                <Box>{numMeal}</Box>
                                <Button>+</Button>
                                <Box width="100%"><Skeleton width="100%" height="24px" /></Box>
                                <Button onClick={() => onOrder()}>Order!</Button>
                                <FontAwesomeIcon
                                    icon={isLike ? faHeart : farFaHeart}
                                    size="xl"
                                    style={{
                                        color: "#ff0000",
                                        transition: "transform 0.3s ease-in-out",
                                        transform: isLike ? "scale(1.3)" : "scale(1)"
                                    }}
                                    onClick={() => {
                                        handleLike();
                                    }}
                                />
                            </HStack>
                        </VStack>
                        <Box width={{ base: "100%", lg: "40%" }}>
                            <Box as="h3" fontSize="3em">
                                Description
                            </Box>
                            <Box>
                                {[...Array(10)].map((_, index) => ( <Skeleton width="100%" height="24px" margin="1%"/>))}
                            </Box>
                        </Box>
                    </Stack>
                </VStack>
            </>
        );
    }
    if (error) return <p>Error: {error.message}</p>;

    if (data) {
        return (
            <>
                <VStack w="100%" align="start" padding="100px 0" id="menu">
                    <Stack w="100%" justifyContent={{ base: "none", lg: "space-between" }} marginBottom="50px" direction={{ base: "column", lg: "row" }}>
                        <VStack width={{ base: "100%", lg: "50%" }}>
                            <Box as="h3" textStyle="StyledH2" color="#333333">{data.strMeal}</Box>
                            <Box width="100%" height="600px">
                                {/* <Image src={data.strMealThumb} alt={data.strMeal} boxSize="100%"></Image> */}
                                <LazyLoadImage
                                    src={data.strMealThumb}
                                    alt={data.strMeal}
                                    width="100%"
                                    imgWidth="600"
                                    auto="webp"
                                    height="600px"
                                    objectFit="cover"
                                />
                            </Box>

                            <HStack width="50%">
                                <Button onClick={() => {
                                    let newNumMeal = numMeal - 1;
                                    let newPrice = parseFloat((newNumMeal * data.price).toFixed(2));
                                    setNumMeal(newNumMeal);
                                    setPrice(newPrice);
                                }}>-</Button>
                                <Box>{numMeal}</Box>
                                <Button onClick={() => {
                                    let newNumMeal = numMeal + 1;
                                    let newPrice = parseFloat((newNumMeal * data.price).toFixed(2));
                                    setNumMeal(newNumMeal);
                                    setPrice(newPrice);
                                }}>+</Button>
                                <Box width="100%">Total Price: {Number(price)}</Box>
                                <Button onClick={() => onOrder()}>Order!</Button>
                                <FontAwesomeIcon
                                    icon={isLike ? faHeart : farFaHeart}
                                    size="xl"
                                    style={{
                                        color: "#ff0000",
                                        transition: "transform 0.3s ease-in-out",
                                        transform: isLike ? "scale(1.3)" : "scale(1)"
                                    }}
                                    onClick={() => {
                                        handleLike();
                                    }}
                                />
                            </HStack>
                        </VStack>
                        <Box width={{ base: "100%", lg: "40%" }}>
                            <Box as="h3" fontSize="3em">
                                Description
                            </Box>
                            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                        </Box>
                    </Stack>
                </VStack>
            </>
        );
    }

    return null;
};

export default FoodPage2;
