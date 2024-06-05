import {Box, Button, HStack, Image, Stack, VStack} from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import {MealContext} from "../provider/MealContext"
import { useUserRotate } from "../provider/JwtTokenRotate"
import { gql, useLazyQuery, useQuery } from '@apollo/client';
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

const FoodPage2=()=>{
    const [data,setData]=useState()
    // Get the meal name from the URL parameters
    const {strMeal} = useParams()
    // Decode the meal name to handle special characters
    const decodedMeal=decodeURIComponent(strMeal)
    //set initial meal number
    const [numMeal,setNumMeal]=useState(1)
    const [price,setPrice]=useState()
    const { cartItem,setCartItem} = useContext(MealContext);
    const {email,availableAccessToken}=useUserRotate()
    const isUser=availableAccessToken?availableAccessToken:false

    // Fetch meal data when the component mounts or when the meal name changes
    useEffect(()=>{
        (async()=>{
            if(decodedMeal){
            await fetch(`http://localhost:5000/api/foodPage/${decodedMeal}`)
            .then(response=>response.json())
            .then(data=>{
                setData(prevMeal=>({...prevMeal,...data}))
                setPrice(data.price)
            })
            .catch(err=>console.log(err))
            }
        })()
    },[strMeal])


//-----------------------------------------------------------------------------//
//store cart items to database by user email
const onOrder = async () => {
    try {
        await fetch(`http://localhost:5000/api/addToCart`, {
                method: "post",
                body: JSON.stringify({
                    isUser:isUser,
                    email:email?email:"",
                    meal:data.strMeal,
                    numMeal:numMeal,
                    idMeal:data.idMeal,
                    price:price,
                    strMealThumb:data.strMealThumb
                }),
                headers: {
                  "Content-Type": "application/json"
                }
              })
            .then(response=>response.json())
            .then(data=>{console.log(data)})
            setCartItem(currentCartItem=>currentCartItem+numMeal)
    } catch (err) {
        console.log(err);
    }
};

//--------------------------------------------------------------------------//


    if(data){
        return(
            <>
            <VStack w="100%" align="start" padding="100px 0" id="menu">
                <Stack w="100%" justifyContent="space-between" marginBottom="50px" direction={{base:"column",lg:"row"}}>
                <VStack width="50%">
                    <Box as="h3" textStyle="StyledH2" color="#333333">{data.strMeal}</Box>
                    <Image src={data.strMealThumb} alt={data.strMeal} boxSize="100%"></Image>
                    <HStack>
                    <Button onClick={()=>{
                        let newNumMeal = numMeal - 1;
                        //parses a string argument and returns a floating point number.
                        let newPrice = parseFloat((newNumMeal * data.price).toFixed(2));
                        setNumMeal(newNumMeal);
                        setPrice(newPrice);
                    }}>-</Button>
                    <Box>{numMeal}</Box>
                    <Button onClick={()=>{
                        let newNumMeal = numMeal + 1;
                        let newPrice = parseFloat((newNumMeal * data.price).toFixed(2));
                        setNumMeal(newNumMeal);
                        setPrice(newPrice);
                    }}>+</Button>
                    <Box>Total Price: {Number(price)}</Box>
                    <Button onClick={()=>onOrder()}>Order!</Button>

                    </HStack>
                </VStack>
                </Stack>
            </VStack>
            </>
        )
    }
}

export default FoodPage2

