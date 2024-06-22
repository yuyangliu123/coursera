import { Box, Button, Divider, HStack, Image, Text, VStack } from "@chakra-ui/react";
import theme from "../../theme.js";
import { Link } from "react-router-dom";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { HashLink } from "react-router-hash-link";

const MiniCart2 = ({ cart, showMiniCart, setShowMiniCart, ref }) => {
  return (
    <Box
      display={showMiniCart ? "block" : "none"}
      position="absolute"
      backgroundColor="#fff"
      right="0"
      minWidth="400px"
      border="1px solid #ccc"
      onClick={() => setShowMiniCart(!showMiniCart)}
      ref={ref}
    >
      <VStack>
        <Box alignSelf="start" margin="1rem 0 0 1rem" textStyle="StyledNav">
          {!cart ? (
            <>
              Your Cart (0) items
            </>
          ) : (
            <>
              Your Cart ({cart.totalItem} items)
            </>
          )}
        </Box>
        <Button
          onClick={() => setShowMiniCart(!showMiniCart)}
          backgroundColor="#ffffff"
          position="absolute"
          top="10px"
          right="25px"
        >
          <SmallCloseIcon />
        </Button>
        <Box
          width="100%"
          maxHeight="400px"
          overflowX="hidden"
          overflowY="scroll"
        >
          {!cart || cart.totalItem === 0 ? (
            <Box margin="0 0 0 1rem">No Item in Cart</Box>
          ) : (
            Object.values(cart.data).map((item) => {
              return (
                <Box
                  key={item.idMeal}
                  display="block"
                  width="100%"
                  _hover={{ backgroundColor: "#e9e9e9" }}
                >
                  <Link
                    to={`/order2/${item.strMeal}`}
                    state={{
                      strMeal: item.strMeal,
                      strMealThumb: item.strMealThumb,
                      id: item.idMeal,
                    }}
                  >
                    <VStack width="100%">
                      <HStack width="100%">
                        <Box width="8rem">
                          <Image src={item.strMealThumb} width="80%" margin="auto" />
                        </Box>
                        <VStack align="start">
                          <Box textStyle="StyledText" color="#333333">{item.strMeal}</Box>
                          <Box textStyle="StyledText" color="#333333">{item.numMeal} x ${item.baseAmount}</Box>
                        </VStack>
                      </HStack>
                      <Divider size="lg" borderWidth="1px" borderColor="#e5e5e5" />
                    </VStack>
                  </Link>
                </Box>
              );
            })
          )}
        </Box>
        <Box width="100%" display="flex" justifyContent="space-around" paddingBottom="1vh">
          <HashLink to="/cart">
            <Button sx={theme.textStyles.StyledButton.baseStyle} size="md">View Cart</Button>
          </HashLink>
          <Box alignSelf="end" marginRight="1rem" textStyle="StyledNav">
            {!cart ? (
              <>
                Total Price ($0)
              </>
            ) : (
              <>
                Total Price (${cart.totalAmount})
              </>
            )}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}

export default MiniCart2;
