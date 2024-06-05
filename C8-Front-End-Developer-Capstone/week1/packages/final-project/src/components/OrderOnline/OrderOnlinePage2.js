import { VStack,
  Box,
  WrapItem,
  Button,Stack} from "@chakra-ui/react"
import theme from "../../theme.js"
import { faMartiniGlassEmpty } from "@fortawesome/free-solid-svg-icons"
import OrderOnline2 from "./OrderOnline2.js"

const OrderOnlinePage2 = () => {
return (
<>
  <VStack w="100%" align="start" padding="10vh 0" id="menu">
    <Stack w="100%" justifyContent="space-between" marginBottom="50px" direction={{base:"column",lg:"row"}}>
      <Box  as="h1" textStyle="StyledH1" color="black">
        Menu page
      </Box>
    </Stack>
      <OrderOnline2/>
  </VStack>
</>
)
}

export default OrderOnlinePage2