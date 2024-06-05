import { Box, Button, HStack, Heading, Image, Stack, Text, VStack} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
import theme from "../../theme.js"
import { useEffect, useState } from "react";

const OrderOnline = () => {
    const [menu,setMenu]=useState({})
    const [selectedCategory, setselectedCategory] = useState(null); // 新增的狀態變數

    useEffect(()=>{
        fetch(`http://localhost:5000/api/api`)
            .then(response=>response.json())
            .then(data=>setMenu(data))
            .catch((err)=>{console.log(err);})
    },[])
    const [isShow,setIsShow]=useState(false)

    useEffect(() => {
        if (selectedCategory) {
            (async()=>{
                try{
                    fetch(`http://localhost:5000/api/sortByCate`,{
                        method:"post",
                        body:JSON.stringify({selectedCategory}),
                        headers:{
                            "Content-Type":"application/json"
                        }
                    }).then(response=>response.json())
                      .then(data=>setMenu(data))
                      .catch((err)=>{console.log(err);})
                }catch (error) {
                    console.error("Error:", error);
                  }
            })()
        }
    }, [selectedCategory])
    

    if(Object.keys(menu).length>0){
        return(
            <Stack height="1000px" width="100%" justifyContent="space-between"  direction={{lg:"row",base:"column"}}>
                    <Box width="30%">
                        <Heading>Sort by</Heading>
                        <Box width="100%"  textStyle="StyledNav" fontSize="2em" onClick={()=>setIsShow(!isShow)} >Ingredient</Box>
                        <HStack wrap="wrap" display={isShow?"block":"none"}>
                            {
                                Object.values(menu.category||[]).map((value) =>{
                                    if(selectedCategory===null){
                                        return(
                                            <>
                                            <Button onClick={() => {setselectedCategory(value)
                                            }}>{value}</Button>
                                            </>
                                        )
                                    }
                                    return(
                                        <Button
                                        onClick={() => {
                                            setselectedCategory(selectedCategory===value?null:value)
                                        }}
                                        >
                                            {value}
                                        </Button>
                                    )
                                })
                            }
                        </HStack>
                    </Box>
                    <VStack width="100%" alignItems="flex-start">
                    <HStack wrap="wrap">
                        {
                            Object.values(menu.data||[]).map((value) =>{
                                if(selectedCategory ===null){
                                    return(
                                        <>
                                        <Text backgroundColor="red">{value.strMeal}</Text>
                                        </>
                                    )
                                }
                                return(
                                    <>
                                    <Text backgroundColor="red">{value.strMeal}</Text>
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
