import { Box, Button, HStack, Heading, Image, Stack, Text, VStack} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
import theme from "../../theme.js"
import { useEffect, useState } from "react";

const OrderOnline = () => {
    const [menu,setMenu]=useState({})
    const [selectedKey, setSelectedKey] = useState(null); // 新增的狀態變數

    useEffect(()=>{
        fetch(`http://localhost:5000/api/api`)
            .then(response=>response.json())
            .then(data=>setMenu(data))
            .catch((err)=>{console.log(err);})
    },[])
    const [isShow,setIsShow]=useState(false)

    if(Object.keys(menu).length>0){
        console.log(menu);
        return(
            <Stack height="1000px" width="100%" justifyContent="space-between"  direction={{lg:"row",base:"column"}}>
                    <Box width="30%">
                        <Heading>Sort by</Heading>
                        <Box width="100%"  textStyle="StyledNav" fontSize="2em" onClick={()=>setIsShow(!isShow)} >Ingredient</Box>
                        <HStack wrap="wrap" display={isShow?"flex":"none"}>
                            {
                                Object.keys(menu).map((key) =>{
                                    if(selectedKey===null){
                                        return(
                                            <>
                                            <Button onClick={() => setSelectedKey(key)}>{key}</Button>
                                            </>
                                        )
                                    }
                                    return(
                                        <Button onClick={() => setSelectedKey(selectedKey===key?null:key)}>{key}</Button>
                                    )
                                })
                            }
                        </HStack>
                    </Box>
                    <VStack width="100%" alignItems="flex-start">
                    <HStack wrap="wrap">
                        {
                            Object.keys(menu).map((key) => {
                                if(selectedKey ===null){
                                    return(
                                        <>
                                            {
                                            menu[key].map((value)=>{
                                                return(
                                                    <Text>{value.strMeal}</Text>
                                                )
                                            })}
                                        </>
                                    )
                                }
                                return(
                                    <>
                                        {
                                            (selectedKey===key) && menu[key].map((value)=>{
                                                return(
                                                    <Text>{value.strMeal}</Text>
                                                )
                                            })
                                        }
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
