import React from "react";
import { Helmet } from "react-helmet";
import { Image, Text, Heading, Flex, Box } from "@chakra-ui/react";

export default function DesktopOnePage() {
  return (
    <>
      <Helmet>
        <title>Yu-yang yang's Application3</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <Box h="1024px" pb={{ md: "118px", base: "20px" }} bg="white.A700" w="100%" position="relative">
        <Flex
          pl="140px"
          pr="56px"
          bg="blue_gray.700"
          w="100%"
          flexDirection="column"
          alignItems="start"
          justifyContent="center"
          position="absolute"
          top="0.00px"
          right="0px"
          left="0px"
          py="140px"
          m="auto"
          p={{ md: "", base: "20px" }}
        >
          <Heading as="h1" ml={{ md: "14px", base: "0px" }} fontSize="80px">
            Little Lemon
          </Heading>
          <Text size="s" color="gray.200" ml={{ md: "14px", base: "0px" }} fontSize="64px">
            Chicago
          </Text>
          <Text mt="79px" mb="50px" ml={{ md: "14px", base: "0px" }} fontSize="32px" w={{ md: "27%", base: "100%" }}>
            <>
              We are a family owned
              <br />
              Mediterranean
              <br />
              restaurant, focused on
              <br />
              traditional recipes served with a modern twist.
            </>
          </Text>
        </Flex>
        <Image
          src="images/img_twisted_cinnamon_buns_feat_1.png"
          h="762px"
          w="54%"
          position="absolute"
          bottom="12%"
          right="9%"
          m="auto"
          borderRadius="50px"
        />
      </Box>
    </>
  );
}
