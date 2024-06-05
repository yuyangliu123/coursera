import { Box, Button, Divider, HStack, Image, Text, VStack } from "@chakra-ui/react"
import theme from "../../theme.js";
import { Link } from "react-router-dom";
import { SmallCloseIcon } from "@chakra-ui/icons";
const MiniCart=({cart,showMiniCart,setShowMiniCart,ref})=>{
    return(
        <Box
        display={showMiniCart?"block":"none"}
        position="absolute"
        backgroundColor="#fff"
        right="0"
        minWidth="400px"
        maxHeight="500px"
        border="1px solid #ccc"
        onClick={()=>setShowMiniCart(!showMiniCart)}
        ref={ref}
        overflow="scroll"
        >
          <VStack>
          <Box alignSelf="start" margin="1rem 0 0 1rem"  textStyle="StyledNav">Your Cart ({cart.shoppingcart.totalItem} items)</Box>
          <Button
          onClick={() => setShowMiniCart(!showMiniCart)}
          backgroundColor="#ffffff"
          position="absolute"
          top="10px"
          right="25px"><SmallCloseIcon/></Button>
            {Object.values(cart.shoppingcart.data).map((item)=>{
              return(
                <>
                <Box
                display="block"
                width="100%">
                <Link
                to={`/order/${item.strMeal}`}
                state= {{
                  strMeal:item.strMeal,
                  strMealThumb: item.strMealThumb,
                  id:item.idMeal }}
                                >
                <VStack width="100%">
                <HStack width="100%">
                  <Box width="8rem"><Image src={item.strMealThumb} width="80%" margin="auto"></Image></Box>
                  <VStack align="start">
                    <Box textStyle="StyledText" color="#333333">{item.strMeal}</Box>
                    <Box textStyle="StyledText" color="#333333">{item.numMeal} x ${item.baseAmount}</Box>
                  </VStack>

                </HStack>
                <Divider size="lg" borderWidth="1px"
                        borderColor="#e5e5e5" />
                </VStack>
                </Link>
                </Box>
                </>
              )
            })}
            <Box alignSelf="end" marginRight="1rem" textStyle="StyledNav">Total Price (${cart.shoppingcart.totalAmount})</Box>
          </VStack>
        </Box>
    )
}

export default MiniCart