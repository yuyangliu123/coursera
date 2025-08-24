import { VStack,
  Image,
  Box,
  Text,
  WrapItem,
Button,
Stack} from "@chakra-ui/react"
import theme from "../../theme.js"

const Header = () => {
return (
<>
  <VStack align={{ base: "center", lg: "start" }} id="top">
    <Stack
    direction={{base:"column",lg:"column"}}
    alignItems={{base:"center",lg:"start"}}
    width="100%"
    >
    <Box  as="h1"  textStyle="StyledH1" textAlign="center">
      Little Lemon
    </Box>
    <Box as="h2" noOfLines={1} textStyle="StyledH2">
      Chicago
    </Box>
    </Stack>
    <Text width={{base:"90%",lg:"45%"}} textStyle="StyledText">
      We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
    </Text>
    <WrapItem>
      <a href="/reservation"><Button sx={theme.textStyles.StyledButton.baseStyle} size={{lg:"lg",base:"md"}}>Reserve a Table</Button></a>
    </WrapItem>
  </VStack>
  <Image src="/images/restauranfood.webp"
    alt="restauran food"
    display={{lg:"block",base:"none"}}
    height="430px"
    width="430px"
    borderRadius="16"
    margin="3% 0"/>
</>
)
}

export default Header
