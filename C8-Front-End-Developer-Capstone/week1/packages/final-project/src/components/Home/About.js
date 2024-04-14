import { VStack, HStack, Heading, Image, Box, Text, WrapItem, Button } from "@chakra-ui/react";
import FullScreenSection from "../FullScreenSection.js";
import theme from "../../theme.js";

const About = () => {
    return (
        <>
            <VStack align="start" width="50%">
                <Box as="h1" noOfLines={1} textStyle="StyledH1">
                    Little Lemon
                </Box>
                <Box as="h2" noOfLines={1} textStyle="StyledH2" color="#333333">
                    Chicago
                </Box>
                <Text width="70%" textStyle="StyledText" color="#333333">
                    Little Lemon is owned by two Italian brothers, Mario and Adrian, who moved to the United States to pursue their shared dream of owning a restaurant.
                </Text>
                <Text width="70%" textStyle="StyledText" color="#333333">
                    To craft the menu, Mario relies on family recipes and his experience as a chef in Italy. Adrian does all the marketing for the restaurant and led the effort to expand the menu beyond classic Italian to incorporate additional cuisines from the Mediterranean region.
                </Text>
            </VStack>
            <Box width="fit-content"
            display= "flex"
            justify-content= "flex-start"
            position="relative">
                <Image src="./images/Mario and Adrian B.jpg"
                    alt="Mario and Adrian B"
                    objectFit= "cover"
                    width="24rem"
                    height="33rem"
                    borderRadius="16"
                    margin="1% 0"></Image>
                <Image src="./images/Mario and Adrian A.jpg"
                    alt="Mario and Adrian A"
                    objectFit="cover"
                    width="24rem"
                    height="33rem"
                    position="absolute"
                    left= "-14rem"
                    top= "12rem"
                    borderRadius="16"
                    margin="1% 0"></Image>
            </Box>
        </>
    )
}

export default About;
