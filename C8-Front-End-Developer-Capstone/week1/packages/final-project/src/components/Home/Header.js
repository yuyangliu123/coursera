import {
  VStack,
  Image,
  Box,
  Text,
  Button,
  Stack,
  WrapItem
} from "@chakra-ui/react"
import theme from "../../theme.js"
import navConfig from "../Nav/config/navConfig.js"
import { Modal, ModalButton, ModalContent } from "../provider/ModalsSystem.js";
import BookingForm from "../Booking/BookingForm.js";

const Header = () => {
  return (
    <>
      <VStack align={{ base: "center", [navConfig.showNavSize]: "start" }} id="top">
        <Stack
          direction={{ base: "column", [navConfig.showNavSize]: "column" }}
          alignItems={{ base: "center", [navConfig.showNavSize]: "start" }}
          width="100%"
        >
          <Box as="h1" textStyle="StyledH1" textAlign="center">
            Little Lemon
          </Box>
          <Box as="h2" noOfLines={1} textStyle="StyledH2">
            Chicago
          </Box>
        </Stack>
        <Text width={{ base: "90%", [navConfig.showNavSize]: "45%" }} textStyle="StyledText">
          We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
        </Text>

        <Modal id="reservation">
          <ModalButton
            sx={theme.textStyles.StyledButton.baseStyle}
            size={{ [navConfig.showNavSize]: "[navConfig.showNavSize]", base: "md" }}
            borderRadius="0.3rem"
            padding="0 0.3rem"
          >
            Reserve a Table
          </ModalButton>
          <ModalContent>
            <BookingForm />
          </ModalContent>
        </Modal>
      </VStack>
      <Image src="/images/restauranfood.webp"
        alt="restauran food"
        display={{ [navConfig.showNavSize]: "block", base: "none" }}
        height="430px"
        width="430px"
        borderRadius="16"
        margin="3% 0" />
    </>
  )
}

export default Header
