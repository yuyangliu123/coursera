import { VStack,
    HStack,
    Heading,
    Image,
    Box,
    Text,
    WrapItem,
    Button} from "@chakra-ui/react"
import theme from "../../../theme.js"
import Card from "./Card.js"

const Main = () => {
return (
  <>
    <VStack w="100%" align="start" padding="100px 0">
      <HStack w="100%" justifyContent="space-between" marginBottom="50px">
        <Box  as="h1" noOfLines={1} textStyle="StyledH1" color="black">
          This Weeks specials!
        </Box>
        <WrapItem>
          <Button sx={theme.textStyles.StyledButton.baseStyle} size="lg">Online Menu</Button>
        </WrapItem>
      </HStack>
      <HStack height="600px" justifyContent="space-between">
        <Card/>
      </HStack>
    </VStack>
  </>
)
}

export default Main
