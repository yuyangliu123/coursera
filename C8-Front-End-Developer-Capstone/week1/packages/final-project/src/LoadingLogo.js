import { Box, ChakraProvider, Image } from "@chakra-ui/react"
import theme from "./theme"

const LoadingLogo = () => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          backgroundColor="white"
          zIndex="overlay"
          css={{
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" }
            },
            "@keyframes pulse": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" }
            },
            "@keyframes loading": {
              "0%": { width: "0%", left: "0" },
              "50%": { width: "100%", left: "0" },
              "100%": { width: "0%", left: "100%" }
            }
          }}
        >
          <Box
            as="h1"
            textStyle="StyledH1"
            marginBottom={{ base: 4, md: 6 }}
          // animation="fadeIn 0.8s ease-out"
          >
            Little Lemon
          </Box>
          <Image
            src="/images/Logo.png"
            alt="Little Lemon Restaurant Logo"
            boxSize={{ base: "150px", md: "200px" }}
            objectFit="contain"
            animation="pulse 2s infinite"
            loading="eager" // 優先加載
          />
          <Box
            marginTop={8}
            width="100px"
            height="2px"
            bg="gray.100"
            borderRadius="full"
            overflow="hidden"
          >
            <Box
              width="30%"
              height="100%"
              bg="primary.500"
              animation="loading 1.5s ease-in-out infinite"
            />
          </Box>
        </Box>
      </ChakraProvider>
    </>
  )
}

export default LoadingLogo