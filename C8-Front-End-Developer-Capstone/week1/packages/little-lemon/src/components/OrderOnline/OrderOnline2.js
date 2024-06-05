import { Box, Button, HStack, Image, Stack, Text, VStack} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
import theme from "../../theme.js"
import { useEffect, useState } from "react";

const OrderOnline2 = () => {
    const [menu,setMenu]=useState({})
    const [selectedKey, setSelectedKey] = useState(null); // 新增的狀態變數

    useEffect(()=>{
        fetch(`http://localhost:5000/api/api`)
            .then(response=>response.json())
            .then(data=>setMenu(data))
            .catch((err)=>{console.log(err);})
    },[])

    if(Object.keys(menu).length>0){
        return(
            <Stack height="1000px" width="100%" justifyContent="space-between"  direction={{lg:"row",base:"column"}}>
                <VStack width="100%">
                <HStack>
                    {
                        Object.keys(menu).map((key) =>{
                                return(
                                    <>
                                    <Button onClick={() => setSelectedKey(key)}>{key}</Button>
                                    </>
                                )
                        })
                    }
                </HStack>
                <HStack>
                    {
                        Object.values(menu).map((value) => {
                                        return(
                                            <Text>{value.strMeal}</Text>
                                        )
                        })
                    }
                </HStack>
                </VStack>
            </Stack>
        )
    }
};

export default OrderOnline2
