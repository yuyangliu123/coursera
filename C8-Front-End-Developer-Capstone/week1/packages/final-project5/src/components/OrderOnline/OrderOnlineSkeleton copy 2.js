import { Box, Button, Grid, GridItem, HStack, Heading, Image, Skeleton, Spinner, Stack, Text, VStack, getToastPlacement } from "@chakra-ui/react";
import useBreakpoint from "../provider/useBreakpoint.js";
import SearchSuggestionBox from "./SearchSuggestionBox.js";
import SearchSuggestionBoxMobile from "./SearchSuggestionBoxMobile.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
const OrderOnlineSkeleton = () => {
    const eachColCounts = useBreakpoint(
        {
            xs: 400,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1400
        },
        {
            xxl: 4,
            xl: 4,
            lg: 4,
            md: 3,
            sm: 2,
            xs: 2,
            base: 1
        });
    const isLargerThanLG = useBreakpoint(
        {
            xs: 400,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1400
        },
        {
            xxl: true,
            xl: true,
            lg: true,
            md: true,
            sm: false,
            xs: false,
            base: false
        });
    return (
        <VStack>
            <Stack minHeight="auto" width="100%" justifyContent="space-between" direction={{ lg: "row", base: "column" }}>
                <Box
                    width={{ lg: "25%", base: "100%" }}
                    backgroundColor="#fbdabb4d"
                    height="fit-content"
                    padding="0 0 3vh 3vh"
                    display={{ base: "none", lg: "block" }}
                >
                    <Box width="100%" textStyle="StyledNav" fontSize="2rem">
                        <HStack>
                            <Box>
                                Ingredient
                            </Box>
                            <Box>
                                <FontAwesomeIcon icon={faChevronUp} />
                            </Box>
                        </HStack>
                    </Box>
                </Box>
                <Stack width={{ lg: "70%", base: "100%" }}>
                    <HStack id="filterContainer" justifyContent="space-between">
                        <Box as="h1" textStyle="StyledH1" color="black" id="currentResults" fontSize={{ xxl: "64px", lg: "32px", sm: "64px", base: "50px" }}>
                            Menu page
                        </Box>
                        {isLargerThanLG ? <SearchSuggestionBox /> : <SearchSuggestionBoxMobile />}
                        <Box display={{ lg: "block", base: "none" }}>
                            <HStack
                                width="20vh"
                                justifyContent="space-between"
                            >
                                <Box>
                                    Sort By
                                </Box>
                                <Skeleton height="18px" width="10vh" />
                            </HStack>

                        </Box>

                    </HStack>
                    <Grid
                        templateColumns={`repeat(${eachColCounts},1fr)`}
                        templateRows="repeat(5, 1fr)"
                        backgroundColor="#fbdabb4d"
                    >                        {
                            [...Array(20)].map((_, index) => (
                                <GridItem margin="0 5px 30px 0" border="1px solid #e4e4e4">
                                    <Skeleton height="250px" width="100%" key={index} />
                                    <Box padding="0.5rem 1rem .75rem">
                                        <Skeleton height={{ xxl: "20px", base: "18px" }} width="100%" marginBottom="0.625rem" key={index} />
                                        <Skeleton height={{ xxl: "20px", base: "18px" }} width="100%" marginRight="1rem" key={index} />
                                    </Box>
                                </GridItem>
                            ))}
                    </Grid>

                </Stack>
                <Box
                    width="100%"
                    backgroundColor="red"
                    height="4vh"
                    position="fixed"
                    bottom="0"
                    left="0"
                    display={{ base: "block", lg: "none" }}
                    zIndex="100"
                    justifyItems="center"
                >
                    <Box
                        margin="0 auto"
                        width="fit-content"
                        textStyle="StyledNav"
                        fontSize="1.5em"
                    >
                        + FILTERS
                    </Box>
                </Box>
            </Stack>

        </VStack>
    );
}

export default OrderOnlineSkeleton