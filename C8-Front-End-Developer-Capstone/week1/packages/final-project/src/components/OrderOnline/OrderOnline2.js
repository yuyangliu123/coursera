import { Box, Button, HStack, Heading, Image, Stack, Text, VStack} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
import theme from "../../theme.js"
import { useEffect, useRef, useState } from "react";
import FoodButton from "./FoodButton.js";
import { Route, Router, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const OrderOnline2 = () => {
    const [isShow,setIsShow]=useState(false)
    const [menu,setMenu]=useState({})
    const location=useLocation() //to get current location
    // Fetch initial menu data, default show first 20 meals
    useEffect(()=>{
        fetch(`http://localhost:5000/api/api`)
            .then(response=>response.json())
            .then(data=>setMenu(data))
            .catch((err)=>{console.log(err)})
    },[])
// Fetch category-specific menu data when location changes
    useEffect(()=>{
        (async() => {
        const query = new URLSearchParams(location.search);
        const category = query.get('category');
        if (category) {
          fetch(`http://localhost:5000/api/order?category=${category}`)
            .then(response => response.json())
            .then(data=>{
                // combine old menu(contain category) with new menu
                // if setMenu(data), then new menu doesn't contain category which be used to create button in OrderOnline2.js
                setMenu(prevMenu => ({...prevMenu, ...data})); //important
            })
            .catch(err => console.log(err));
        }
      })()}, [location.search]);

      if (Object.keys(menu).length > 0) {
        return (
          <Stack height="auto" width="100%" justifyContent="space-between" direction={{ lg: "row", base: "column" }}>
            <Box width="30%" backgroundColor="#fbdabb4d" height="fit-content" padding="0 0 3vh 3vh">
              <Text as="h2">Sort by</Text>
              <Box textStyle="StyledNav" fontSize="2em" onClick={() => setIsShow(!isShow)}>
                Ingredient
              </Box>
              <VStack display={isShow ? "flex" : "none"} marginLeft="0">
                {Object.values(menu.category || []).map(value => (
                  <FoodButton key={value} category={value} setMenu={setMenu} menu={menu} marginLeft="3vh" />
                ))}
              </VStack>
            </Box>
            <Box width="70%" display="grid" gridTemplateColumns={{xl:"repeat(4, 1fr)",lg:"repeat(3, 1fr)",md:"repeat(2, 1fr)",base:"repeat(1, 1fr)"}} gap="10px" height="fit-content">
              {Object.values(menu.data || []).map(value => (
                <VStack
                  key={value.idMeal}
                  width="100%"
                  border=".063rem solid #e4e4e4"
                  marginBottom="3.125rem"
                  height="auto"
                  _hover={{img:{opacity:0.7},p:{color:"#da1a32"}}}
                  >
                  <Link
                    to={`/order2/${value.strMeal}`}
                    >
                    <Image
                      src={value.strMealThumb}
                      alt={value.strMeal}
                      width="250px"
                      height="250px"
                      objectFit="cover"/>
                    <Box padding="1.25rem 1rem .75rem">
                      <Text
                        textStyle="StyledText"
                        color="#333333"
                        align="center"
                        marginBottom="0.625rem"
                        >
                          {value.strMeal}
                        </Text>
                      <Box>
                        <Text
                          textStyle="StyledText"
                          color="#333333"
                          align="end"
                          marginRight="1rem"
                        >
                          Price: ${value.price}
                        </Text>
                        </Box>
                    </Box>
                  </Link>
                </VStack>
              ))}
            </Box>
          </Stack>
        );
      }
      return null;
    };
    

export default OrderOnline2

