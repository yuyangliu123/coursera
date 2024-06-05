import { Box, Button, HStack, Image, Stack, Text, VStack} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
import theme from "../../theme.js"
import pako from "pako"
import { useEffect, useState } from "react";
const OrderOnline = () => {
    const [menu,setMenu]=useState({})
    const [selectedKey, setSelectedKey] = useState(null); // 新增的狀態變數

    useEffect(() => {
        fetch(`http://localhost:5000/api/api`)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const decompressedData = pako.inflate(new Uint8Array(buffer), { to: 'string' });
                const data = JSON.parse(decompressedData);
                setMenu(data);
            })
            .catch((err) => { console.log(err); })
    }, [])
    console.log(menu);

    if(Object.keys(menu).length>0){
        console.log(menu);
        return(
            <Stack height="1000px" width="100%" justifyContent="space-between"  direction={{lg:"row",base:"column"}}>
                <VStack width="100%">
                <HStack>
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
                <HStack width="100%" wrap="wrap">
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
