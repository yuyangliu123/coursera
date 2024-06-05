import { gql, useQuery } from '@apollo/client';
import { Box, Button, HStack, Image, Input, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useUserRotate } from '../provider/JwtTokenRotate';
import { useState, useEffect, useContext } from 'react';
import { MealContext } from '../provider/MealContext';
import { SmallCloseIcon } from "@chakra-ui/icons";
const CART_QUERY = gql`
    query Shoppingcarts($email: String) {
        shoppingcarts(email: $email) {
            totalItem
            data {
                idMeal
                strMealThumb
                strMeal
                numMeal
                baseAmount
            }
            totalAmount
        }
    }
`;

const CartPage = () => {
    const { email } = useUserRotate();
    const { cartItem, setCartItem } = useContext(MealContext);
    const { data: cart, loading, error } = useQuery(CART_QUERY, { variables: { email } });
    const [cartData, setCartData] = useState(null);
    const [inputValues, setInputValues] = useState({});
    const [updatedItems, setUpdatedItems] = useState({});
    const [isUpdate,setIsUpdate]=useState(false)
    const handleChangeValue = (meal, value) => {
        // 更新購物車的數量
        const updatedCartData = {...cartData};
        const updatedData = [...updatedCartData.data];
        const mealIndex = updatedData.findIndex(item => item.strMeal === meal.strMeal);
        if(mealIndex !== -1) {
            const filterMeal= {...updatedData[mealIndex]};
            const updatedMeal = Object.fromEntries(
                Object.entries(filterMeal).filter(([key]) => ["baseAmount","idMeal","numMeal"].includes(key))
              );
            updatedMeal.numMeal = Number(value);
            // 將已修改的數據添加到 updatedItems
            setUpdatedItems(prev => ({ ...prev, updatedMeal }));
            console.log({u:updatedItems});
        }
    }

    const handleInputChange = (meal, value) => {
        setInputValues(prev => ({ ...prev, [meal.strMeal]: value }));
    };


    useEffect(() => {
        if(!loading && !error && cart && cart.shoppingcarts && cart.shoppingcarts.length > 0){
            setCartData(cart.shoppingcarts[0]);
        }
    }, [loading, error, cart]);
    useEffect(() => {
        if (cartData) {
            const initialInputValues = {};
            cartData.data.forEach(item => {
                initialInputValues[item.strMeal] = item.numMeal;
            });
            setInputValues(initialInputValues);
        }
    }, [cartData]);
    


    useEffect(()=>{
        (async()=>{
            try {
                fetch("http://localhost:5000/api/update", {
                  method: "post",
                  body: JSON.stringify({email:email, updatedItems: updatedItems.updatedMeal }),
                  headers: { "Content-Type": "application/json" }
                })
                .then(response=>response.json())
                .then(data=>{
                    if(data.status==="update"){
                        setCartData(data.result)
                        setCartItem(data.result.totalItem)
                    }else if(data.status==="delete"){
                        setCartItem(0)
                        setCartData("")
                    }
                    console.log({data:data});
                })
              } catch (error) {
                console.error("Error:", error);
              }
    })()
    },[isUpdate])

    if (loading) {
        return <Box>Loading...</Box>;
    } else if (error) {
        return <Box>Error Occurred</Box>;
    }

    if (!cartData) {
        return <Box>No data</Box>;
    }

    return (
        <HStack width="100%" alignItems="flex-start" spacing={6}>
            <Box width="70%">
                <Table>
                    <Thead>
                        <Tr>
                            <Th colSpan={2}>Item</Th>
                            <Th>Price</Th>
                            <Th>Quantity</Th>
                            <Th>Total</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {cartData.data.map((item, index) => (
                            <Tr key={index}>
                                <Td colSpan={2}>
                                    <HStack width="100%">
                                        <Box width="8rem">
                                            <Image src={item.strMealThumb} width="80%" margin="auto" />
                                        </Box>
                                        <Box textStyle="StyledText" color="#333333">
                                            {item.strMeal}
                                        </Box>
                                    </HStack>
                                </Td>
                                <Td>
                                    <Box>${item.baseAmount}</Box>
                                </Td>
                                <Td>
                                    <HStack>
                                        <Button
                                        backgroundColor="#e5e5e5"
                                        borderRadius="50%"
                                        fontSize="1.5rem"
                                        size="md"
                                        onClick={()=>{
                                            handleChangeValue(item,item.numMeal-1)
                                            setIsUpdate(!isUpdate)
                                            }}>-</Button>
                                         <Input
                                         maxWidth="6vh"
                                         textAlign="center"
                                         value={inputValues[item.strMeal]}
                                            onChange={(e)=>{handleInputChange(item, e.target.value)}}
                                            onBlur={(e)=>{
                                                handleChangeValue(item, Number(e.target.value))
                                                setIsUpdate(!isUpdate)}}
                                        />

                                        <Button
                                        backgroundColor="#e5e5e5"
                                        borderRadius="50%"
                                        fontSize="1.5rem"
                                        size="md"
                                        onClick={()=>{
                                            handleChangeValue(item,item.numMeal+1)
                                            setIsUpdate(!isUpdate)
                                            }}>+</Button>
                                    </HStack>
                                </Td>
                                <Td>
                                    <HStack justifyContent="right">
                                        <Box>${parseFloat(item.baseAmount * item.numMeal).toFixed(2)}</Box>
                                        <Button
                                        backgroundColor="#e5e5e5"
                                        borderRadius="50%"
                                        size="xs"
                                        onClick={()=>{
                                            handleChangeValue(item,0)
                                            setIsUpdate(!isUpdate)
                                        }}><SmallCloseIcon color="#757575"/></Button>
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            <Box width="30%">
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
                
            </Box>
        </HStack>
    );
};

export default CartPage;
