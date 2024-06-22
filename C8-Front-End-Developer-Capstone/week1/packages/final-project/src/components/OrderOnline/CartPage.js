import { gql, useQuery } from '@apollo/client';
import { Box, Button, HStack, Image, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useUserRotate } from '../provider/JwtTokenRotate';
import { useState, useEffect, useContext } from 'react';
import { MealContext } from '../provider/MealContext';
import { SmallCloseIcon } from "@chakra-ui/icons";
import CartPageHeading from './CartPageHeading';
import { Link } from 'react-router-dom';
const CARTPAGE_QUERY = gql`
    query CartPageformat($email: String) {
    cartpageformat(email: $email) {
        totalAmount
        totalItem
        data {
        strMeal
        numMeal
        idMeal
        baseAmount
        strMealThumb
        }
    }
    }
`;

const CartPage = () => {
    const { email } = useUserRotate();
    const { cartItem, setCartItem } = useContext(MealContext);
    const { data: cart, loading, error } = useQuery(CARTPAGE_QUERY, {
        variables: { email },
        fetchPolicy: 'cache-and-network',
    });
    const [cartData, setCartData] = useState(null);
    const [inputValues, setInputValues] = useState({});
    const [updatedItems, setUpdatedItems] = useState({});
    //If a boolean is used, useEffect will not be triggered when isUpdate is false
    const [isUpdate, setIsUpdate] = useState(0)

    // update cart item
    const handleChangeValue = (meal, value) => {
        const updatedCartData = { ...cartData };
        const updatedData = [...updatedCartData.data];
        //The meal currently being operated
        const mealIndex = updatedData.findIndex(item => item.strMeal === meal.strMeal);
        if (mealIndex !== -1) {
            const filterMeal = { ...updatedData[mealIndex] };
            //filter the needed content for posting
            const updatedMeal = Object.fromEntries(
                Object.entries(filterMeal).filter(([key]) => ["baseAmount", "idMeal", "numMeal"].includes(key))
            );

            //update meal number
            updatedMeal.numMeal = Number(value);
            // Add the modified data to updatedItems
            setUpdatedItems(prev => ({ ...prev, updatedMeal }));
        }
    }
    //modify current input
    const handleInputChange = (meal, value) => {
        setInputValues(prev => ({ ...prev, [meal.strMeal]: value }));
    };

    //set number of current cart item to nav cart icon
    useEffect(() => {
        if (!loading && !error && cart && cart.cartpageformat && cart.cartpageformat.length > 0) {
            setCartData(cart.cartpageformat[0]);
        }
    }, [loading, error, cart]);



    //set input value after loading cartData
    useEffect(() => {
        if (cartData) {
            const initialInputValues = {};
            cartData.data.forEach(item => {
                initialInputValues[item.strMeal] = item.numMeal;
            });
            setInputValues(initialInputValues);
        }
    }, [cartData]);


    //If isUpdate change, post to the backend
    useEffect(() => {
        //When isUpdate exists, useEffect will operate to avoid unnecessary fetches
        //when the screen loads (isUpdate changes from non-existent to existent).
        if (isUpdate) {
            try {
                fetch("http://localhost:5000/api/update", {
                    method: "post",
                    body: JSON.stringify({ event: "update", email: email, updatedItems: updatedItems.updatedMeal }),
                    headers: { "Content-Type": "application/json" }
                })
                    .then(response => response.json())
                    .then(data => {
                        //if status is update, set cartData & cartItem
                        if (data.status === "update") {
                            setCartData(data.result)
                            setCartItem(data.result.totalItem)
                            //if status is delete, set cartItem to 0 and cartData to ""
                        } else if (data.status === "delete") {
                            setCartItem(0)
                            setCartData("")
                        }
                    })
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }, [isUpdate])

    //use apollo to load data
    if (loading) {
        return <Box>Loading...</Box>;
    } else if (error) {
        return <Box>Error Occurred</Box>;
    }

    if (!cartData || cartData.totalItem === 0) {
        return <Box width="100%"><Box textStyle="StyledH2" color="#000000" margin="0 auto" width="fit-content">Your Cart is Empty</Box></Box>
    }

    return (
        <VStack width="100%">
            <CartPageHeading numItem={cartData.totalItem} />
            <Stack direction={{ xl: "row", base: "column" }} width="100%" alignItems="flex-start" spacing={6}>
                <Box width={{ xl: "75%", base: "100%" }}>
                    <Table display={{ md: "table", base: "block" }} width="100%">
                        <Thead display={{ md: "table-header-group", base: "none" }}>
                            <Tr>
                                <Th colSpan={3}>Item</Th>
                                <Th>Price</Th>
                                <Th>Quantity</Th>
                                <Th>Total</Th>
                            </Tr>
                        </Thead>
                        <Tbody display={{ md: "table-row-group", base: "block" }}>
                            {cartData.data.map((item, index) => (
                                <Tr key={index}
                                    borderBottomWidth="1px"
                                    display={{ md: "table-row", base: "grid" }}
                                    gridTemplateAreas={{
                                        md: "none",
                                        sm: `
                                "img meal meal meal"
                                "img price quantity total"
                                `,
                                        base: `
                                    "img meal"
                                    "price price"
                                    "quantity quantity"
                                    "total total"
                                `
                                    }}
                                >
                                    <Td colSpan={1} gridArea={"img"} display={{ md: "table-cell", base: "block" }} paddingLeft="0" paddingRight="0" borderBottomWidth={{ md: "1px", base: "0" }}>
                                        <Box width="8rem">
                                            <Image src={item.strMealThumb} width="80%" margin="auto" />
                                        </Box>
                                    </Td>
                                    <Td colSpan={2} gridArea={"meal"} display={{ md: "table-cell", base: "flex" }} flexDirection="row" borderBottomWidth={{ md: "1px", base: "0" }} alignItems="center" paddingLeft="0" paddingRight="0">
                                        <Box textStyle="StyledText" color="#333333">
                                            {item.strMeal}
                                        </Box>
                                        <Button
                                            backgroundColor="#e5e5e5"
                                            borderRadius="50%"
                                            size="xs"
                                            //set meal number to 0
                                            //use async/await to prevent Race Condition
                                            onClick={async () => {
                                                await handleChangeValue(item, 0)
                                                await setIsUpdate(isUpdate + 1)
                                            }}
                                            display={{ md: "none", base: "block" }}
                                            marginLeft="1rem"
                                        ><SmallCloseIcon color="#757575" /></Button>
                                    </Td>
                                    <Td
                                        gridArea={"price"}
                                        display={{ md: "table-cell", base: "flex" }}
                                        flexDirection={{ md: "none", sm: "column", base: "row" }}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                    >
                                        <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Price</Text>
                                        <Box>${item.baseAmount}</Box>
                                    </Td>
                                    <Td
                                        gridArea={"quantity"}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                        display={{ md: "table-cell", base: "flex" }}
                                        flexDirection={{ md: "none", sm: "column", base: "row" }}
                                    >
                                        <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Quantity</Text>
                                        <HStack>
                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                fontSize="1.5rem"
                                                size="md"
                                                //use async/await to prevent Race Condition
                                                onClick={async () => {
                                                    await handleChangeValue(item, item.numMeal - 1)
                                                    await setIsUpdate(isUpdate + 1)
                                                }}>-</Button>
                                            <Input
                                                maxWidth="8vh"
                                                width="8vh"
                                                textAlign="center"
                                                value={inputValues[item.strMeal]}
                                                //can change the input number through typing, but the fetch will only be triggered on blur
                                                onChange={(e) => { handleInputChange(item, e.target.value) }}
                                                onBlur={async (e) => {
                                                    await handleChangeValue(item, Number(e.target.value))
                                                    await setIsUpdate(isUpdate + 1)
                                                }}
                                            />

                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                fontSize="1.5rem"
                                                size="md"
                                                //use async/await to prevent Race Condition
                                                onClick={async () => {
                                                    await handleChangeValue(item, item.numMeal + 1)
                                                    await setIsUpdate(isUpdate + 1)
                                                }}>+</Button>
                                        </HStack>
                                    </Td>
                                    <Td
                                        gridArea={"total"}
                                        display={{ md: "table-cell", base: "flex" }}
                                        flexDirection={{ md: "none", sm: "column", base: "row" }}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                    >
                                        <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Total</Text>
                                        <HStack justifyContent={{ md: "right", base: "none" }}>
                                            <Box gridArea={"total"}>${parseFloat(item.baseAmount * item.numMeal).toFixed(2)}</Box>
                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                size="xs"
                                                //set meal number to 0
                                                //use async/await to prevent Race Condition
                                                onClick={async () => {
                                                    await handleChangeValue(item, 0)
                                                    await setIsUpdate(isUpdate + 1)
                                                }}
                                                gridArea={"delete"}
                                                display={{ md: "block", base: "none" }}
                                            ><SmallCloseIcon color="#757575" /></Button>
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Box width={{ xl: "25%", md: "50%", base: "100%" }}>
                    <Table>
                        <Thead>
                            <Th>Order Summary</Th>
                        </Thead>
                    </Table>
                    <HStack justifyContent="space-between">
                        <Box>Subtotal:</Box>
                        <Box>${cartData.totalAmount}</Box>
                    </HStack>
                    <HStack justifyContent="space-between">
                        <Box>Grand total:</Box>
                        <Box>${cartData.totalAmount}</Box>
                    </HStack>
                    <Link to="/checkout/#deliver">
                        <Button
                            color="#ffffff"
                            backgroundColor="#da1a32"
                            border="1px solid #da1a32"
                            width="100%"
                            marginTop="1vh"
                            _hover={{
                                color: "#da1a32",
                                backgroundColor: "#ffffff"
                            }}
                        >
                            CHECKOUT
                        </Button>
                    </Link>
                </Box>
            </Stack>
        </VStack>
    );
};

export default CartPage;
