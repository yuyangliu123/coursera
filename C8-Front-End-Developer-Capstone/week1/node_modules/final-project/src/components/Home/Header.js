import { VStack,
    HStack,
    Heading,
    Image,
    Box,
    Text,
    WrapItem,
Button} from "@chakra-ui/react"
import FullScreenSection from "../FullScreenSection.js"
import theme from "../../theme.js"

const Header = () => {
return (
  <>
    <VStack align="start">
      <Box  as="h1" noOfLines={1} textStyle="StyledH1">
        Little Lemon
      </Box>
      <Box as="h2" noOfLines={1} textStyle="StyledH2">
        Chicago
      </Box>
      <Text width="45%" textStyle="StyledText">
        We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
      </Text>
      <WrapItem>
        <Button sx={theme.textStyles.StyledButton.baseStyle} size="lg">Reserve a Table</Button>
      </WrapItem>
    </VStack>
    <Image src="./images/restauranfood.jpg"
      alt="restauran food"
      height="430px"
      width="430px"
      borderRadius="16"
      margin="1% 0"></Image>
  </>
)
}

export default Header
