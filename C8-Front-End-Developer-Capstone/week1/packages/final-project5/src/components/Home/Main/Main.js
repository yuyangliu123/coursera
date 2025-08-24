import { VStack,
  Box,
  WrapItem,
  Button,Stack} from "@chakra-ui/react"
import theme from "../../../theme.js"
import Card from "./Card.js"
import { faMartiniGlassEmpty } from "@fortawesome/free-solid-svg-icons"
import { HashLink } from "react-router-hash-link"

const Main = () => {
return (
<>
  <VStack w="100%" align="start" padding={{base:"30px 0",lg:"100px 0"}} id="menu">
    <Stack w={{base:"auto",lg:"100%"}} justifyContent={{base:"none",lg:"space-between"}} margin={{base:"0 auto",lg:"0 0 50px 0"}} direction={{base:"column",lg:"row"}}>
      <Box  as="h1" textStyle="StyledH1" color="black" width="fit-content">
        This Weeks specials!
      </Box>
      <WrapItem margin={{base:"0 auto",lg:"0"}}>
        <Button sx={theme.textStyles.StyledButton.baseStyle} size="lg"><HashLink to="/order2">Online Menu</HashLink></Button>
      </WrapItem>
    </Stack>
    <Stack height="auto" justifyContent="space-between"  direction={{lg:"row",base:"column"}}>
      <Card/>
    </Stack>
  </VStack>
</>
)
}

export default Main