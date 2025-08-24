import { Box, Button, Grid, GridItem, HStack, Heading, Image, Skeleton, Spinner, Stack, Text, VStack, getToastPlacement } from "@chakra-ui/react";
import useBreakpoint from "../provider/useBreakpoint.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import navConfig from "../Nav/config/navConfig.js";
const OrderDetailSkeleton = ({ numCol, numRow, marginTop, backgroundColor }) => {
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
        <Box
            margin="3vh 0"
            width="100%"
            height="100%"
        >
            <Grid
                templateColumns="1fr 1fr"
                templateRows="1"
                gridTemplateAreas={{

                    md:
                        `
                           "main orderSummary"
                           `,
                    base:
                        `
                           "main"
                           "orderSummary"
                           `
                }}
                backgroundColor={`${backgroundColor}`}
                marginTop={`${marginTop}`}
            >

                <GridItem gridArea={"main"} fontSize={{ base: "1.5em", [navConfig.showNavSize]: "2em" }}>
                    <Box>
                        <Box padding="0.5rem 1rem .75rem">
                            <Skeleton height="20px" width="30%" margin="auto" borderRadius="10px" />
                        </Box>
                        <HStack padding="0.5rem 1rem .75rem">
                            <Skeleton height={{ xxl: "40px", base: "40px" }} width="100%" borderRadius="10px" />
                            <Skeleton height={{ xxl: "40px", base: "40px" }} width="100%" borderRadius="10px" />
                            <Skeleton height={{ xxl: "40px", base: "40px" }} width="100%" borderRadius="10px" />
                        </HStack>
                    </Box>
                    <hr></hr>
                    <Box>
                        <Box padding="0.5rem 1rem .75rem">
                            <Skeleton
                                height="20px"
                                width="20%"
                                borderRadius="10px"
                            />
                        </Box>
                        <VStack padding="0.5rem 1rem .75rem">
                            <Skeleton height={{ xxl: "20px", base: "20px" }} width="100%" borderRadius="10px" />
                            <Skeleton height={{ xxl: "20px", base: "20px" }} width="100%" borderRadius="10px" />
                        </VStack>
                    </Box>
                    <hr></hr>
                    <Box>
                        <Box padding="0.5rem 1rem .75rem">
                            <Skeleton
                                height="20px"
                                width="20%"
                                borderRadius="10px"
                            />
                        </Box>
                        <VStack padding="0.5rem 1rem .75rem">
                            <Skeleton height={{ xxl: "20px", base: "20px" }} width="100%" borderRadius="10px" />
                            <Skeleton height={{ xxl: "20px", base: "20px" }} width="100%" borderRadius="10px" />
                        </VStack>
                    </Box>

                </GridItem>
                <GridItem
                    gridArea={"orderSummary"}
                    backgroundColor="#f5f5f5"
                    height="80vh"
                >
                    <Box>
                        <HStack justifyContent="space-around">
                            <HStack>
                                <Box padding="0.5rem 1rem .75rem">
                                    <Skeleton
                                        height="60px"
                                        width="60px"
                                        borderRadius="10px"
                                    />
                                </Box>
                                <VStack padding="0.5rem 1rem .75rem" alignItems="start">
                                    <Skeleton
                                        height="15px"
                                        width="100px"
                                        borderRadius="10px"
                                    />
                                    <Skeleton
                                        height="15px"
                                        width="50px"
                                        borderRadius="10px"
                                    />
                                </VStack>
                            </HStack>
                            <Skeleton
                                height="20px"
                                width="15%"
                                borderRadius="10px"
                            />
                        </HStack>
                        <Box padding="0.5rem 1rem .75rem">
                            <Skeleton
                                height="20px"
                                width="20%"
                                borderRadius="10px"
                            />
                        </Box>
                        <VStack padding="0.5rem 1rem .75rem">
                            <Skeleton height={{ xxl: "20px", base: "20px" }} width="100%" borderRadius="10px" />
                            <Skeleton height={{ xxl: "20px", base: "20px" }} width="100%" borderRadius="10px" />
                        </VStack>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}

export default OrderDetailSkeleton