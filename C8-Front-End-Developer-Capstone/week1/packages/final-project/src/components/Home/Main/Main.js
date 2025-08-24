import { VStack,
  Box,
  WrapItem,
  Button,Stack} from "@chakra-ui/react"
import theme from "../../../theme.js"
import Card from "./Card.js"
import { faMartiniGlassEmpty } from "@fortawesome/free-solid-svg-icons"
import { HashLink } from "react-router-hash-link"
import navConfig from "../../Nav/config/navConfig.js"

const Main = () => {
return (
<>
  <VStack w="100%" align="start" padding={{base:"30px 0",[navConfig.showNavSize]:"100px 0"}} id="menu">
    <Stack w={{base:"auto",[navConfig.showNavSize]:"100%"}} justifyContent={{base:"none",[navConfig.showNavSize]:"space-between"}} margin={{base:"0 auto",[navConfig.showNavSize]:"0 0 50px 0"}} direction={{base:"column",[navConfig.showNavSize]:"row"}}>
      <Box  as="h1" textStyle="StyledH1" color="black" width="fit-content">
        This Weeks specials!
      </Box>
      <WrapItem margin={{base:"0 auto",[navConfig.showNavSize]:"0"}}>
        <Button sx={theme.textStyles.StyledButton.baseStyle} size="lg"><HashLink to="/order2">Online Menu</HashLink></Button>
      </WrapItem>
    </Stack>
    <Stack height="auto" justifyContent="space-between"  direction={{[navConfig.showNavSize]:"row",base:"column"}}>
      <Card/>
    </Stack>
  </VStack>
</>
)
}

export default Main