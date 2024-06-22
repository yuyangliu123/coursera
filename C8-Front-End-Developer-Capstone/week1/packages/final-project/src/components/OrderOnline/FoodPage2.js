import { Box, Button, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MealContext } from "../provider/MealContext";
import { useUserRotate } from "../provider/JwtTokenRotate";
import { gql, useQuery } from '@apollo/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farFaHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const LIKE_QUERY = gql`
query Likeitemnumber($email: String!) {
  likeitemnumber(email: $email) {
    likeItem {
      strMeal
    }
  }
}
`

const FoodPage2 = () => {
    const [data, setData] = useState();
    const { strMeal } = useParams();
    const decodedMeal = decodeURIComponent(strMeal);
    const [numMeal, setNumMeal] = useState(1);
    const [price, setPrice] = useState();
    const { cartItem, setCartItem } = useContext(MealContext);
    const { email, availableAccessToken } = useUserRotate();
    const isUser = availableAccessToken ? availableAccessToken : false;
    const [isLike, setIsLike] = useState(false);

    const { loading, error, data: likeData, refetch } = useQuery(LIKE_QUERY,
        { variables: { email },
        fetchPolicy: 'network-only',
        //if user not login, then useQuery would not be trigger
          skip: !email });

    useEffect(() => {
        if (likeData) {
            const likeItem = likeData.likeitemnumber.flatMap(cart => cart.likeItem);
            const isLiked = likeItem.some(item => item.strMeal === decodedMeal);
            setIsLike(isLiked);
        }
    }, [likeData, decodedMeal]);

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
        //if user not login, then handleLike would not be trigger
        if(!availableAccessToken){
            console.error("User is not logged in. Cannot perform like action.");
            return;
        }
        const newIsLike = !isLike;
        try {
            await fetch(`http://localhost:5000/api/update`, {
                method: "post",
                body: JSON.stringify({
                    event: "like",
                    likeState: newIsLike ? "like" : "none",
                    isUser: isUser,
                    email: email ? email : "",
                    meal: data.strMeal,
                    idMeal: data.idMeal,
                    price: data.price,
                    strMealThumb: data.strMealThumb,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setIsLike(newIsLike);
                    //refetch() is necessary because when navigating to other routes through SPA, it does not reload,
                    //so useQuery will not be triggered. If click handleLike, move to another page (for example, /order2),
                    //and then return to FoodPage, isLiked will not display correctly.
                    refetch()
                    console.log("refetch occur");
                });
        } catch (err) {
            console.log(err);
        }
    };

    const onOrder = async () => {
        const orderData = {
            isUser: isUser,
            meal: data.strMeal,
            numMeal: numMeal,
            idMeal: data.idMeal,
            price: price,
            strMealThumb: data.strMealThumb
        };
        if (!availableAccessToken) {
            console.log("User is not logged in. Saving order locally.");
            let localOrders = JSON.parse(localStorage.getItem('localOrders')) || [];
            localOrders.push(orderData);
            localStorage.setItem('localOrders', JSON.stringify(localOrders));
            setCartItem(currentCartItem => currentCartItem + numMeal);
            return;
        }

        try {
            await fetch(`http://localhost:5000/api/addToCart`, {
                method: "post",
                body: JSON.stringify(Object.assign(orderData,{email:email})),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => { console.log(data) });
            setCartItem(currentCartItem => currentCartItem + numMeal);
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    if (data) {
        return (
            <>
                <VStack w="100%" align="start" padding="100px 0" id="menu">
                    <Stack w="100%" justifyContent="space-between" marginBottom="50px" direction={{ base: "column", lg: "row" }}>
                        <VStack width="50%">
                            <Box as="h3" textStyle="StyledH2" color="#333333">{data.strMeal}</Box>
                            <Image src={data.strMealThumb} alt={data.strMeal} boxSize="100%"></Image>
                            <HStack>
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
                                <Box>Total Price: {Number(price)}</Box>
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
                        <Box width="40%">
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
