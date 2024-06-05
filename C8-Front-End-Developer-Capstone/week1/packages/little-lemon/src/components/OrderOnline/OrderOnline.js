import { Box, Button, HStack, Heading, Image, Stack, Text, VStack} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
import theme from "../../theme.js"
import { useEffect, useRef, useState } from "react";
import FoodButton from "./FoodButton.js";
import { useLocation } from "react-router-dom";

const OrderOnline = () => {
    const [isShow,setIsShow]=useState(false)
    const [menu,setMenu]=useState({})
    const [recipes, setRecipes] = useState([]);
    const location=useLocation() //to get current location
    useEffect(()=>{
        fetch(`http://localhost:5000/api/api`)
            .then(response=>response.json())
            .then(data=>setMenu(data))
            .catch((err)=>{console.log(err);})
    },[])

    useEffect(()=>{
        (async() => {
        const query = new URLSearchParams(location.search);
        const category = query.get('category');
        console.log(category);
        if (category) {
          fetch(`http://localhost:5000/api/order?category=${category}`)
            .then(response => response.json())
            .then(data=>{
                // combine old menu(contain category) with new menu
                // if setMenu(data), then new menu doesn't contain category which be used to create button in OrderOnline.js
                setMenu(prevMenu => ({...prevMenu, ...data})); //important
            })
            .catch(err => console.log(err));
        }
      })()}, [location.search]);

    if(Object.keys(menu).length>0){
        return(
            <Stack height="1000px" width="100%" justifyContent="space-between"  direction={{lg:"row",base:"column"}}>
                    <Box width="30%">
                        <Heading>Sort by</Heading>
                        <Box width="100%"  textStyle="StyledNav" fontSize="2em" onClick={()=>setIsShow(!isShow)} >Ingredient</Box>
                        <HStack wrap="wrap" display={isShow?"block":"none"}>
                            {
                                Object.values(menu.category||[]).map((value) =>{
                                        return(
                                            <>
                                            <FoodButton category={value} setMenu={setMenu} menu={menu}/>
                                            </>
                                        )
                                })
                            }
                        </HStack>
                    </Box>
                    <VStack width="100%" alignItems="flex-start">
                    <HStack wrap="wrap">
                        {
                            Object.values(menu.data||[]).map((value) =>{
                                    return(
                                        <>
                                        <VStack width="24%">
                                            <Text backgroundColor="red">{value.strMeal}</Text>
                                            <Image src={value.strMealThumb} alt={value.strMeal} boxSize="100%"></Image>
                                        </VStack>
                                        
                                        </>
                                    )
                            })
                        }
                    </HStack>
                    </VStack>
            </Stack>
        )
    }
};

export default OrderOnline
