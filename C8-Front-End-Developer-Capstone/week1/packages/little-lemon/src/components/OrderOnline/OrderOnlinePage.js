import { VStack,
  Box,
  WrapItem,
  Button,Stack} from "@chakra-ui/react"
import theme from "../../theme.js"
import { faMartiniGlassEmpty } from "@fortawesome/free-solid-svg-icons"
import OrderOnline from "./OrderOnline.js"

const OrderOnlinePage = () => {
return (
<>
  <VStack w="100%" align="start" padding="100px 0" id="menu">
    <Stack w="100%" justifyContent="space-between" marginBottom="50px" direction={{base:"column",lg:"row"}}>
      <Box  as="h1" textStyle="StyledH1" color="black">
        This Weeks specials!
      </Box>
      <WrapItem>
        <Button sx={theme.textStyles.StyledButton.baseStyle} size="lg">Online Menu</Button>
      </WrapItem>
    </Stack>
      <OrderOnline/>
  </VStack>
</>
)
}

export default OrderOnlinePage