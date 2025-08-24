import { Box, Button, Grid, GridItem, HStack, Heading, Image, Skeleton, Spinner, Stack, Text, VStack, getToastPlacement } from "@chakra-ui/react";
import useBreakpoint from "../provider/useBreakpoint.js";
import SearchSuggestionBox from "./SearchSuggestionBox.js";
import SearchSuggestionBoxMobile from "./SearchSuggestionBoxMobile.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
const OrderOnlineSkeleton = ({numCol,numRow,marginTop,backgroundColor}) => {
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
                    <Grid
                        templateColumns={`repeat(${eachColCounts},1fr)`}
                        templateRows={`repeat(${numRow},1fr)`}
                        backgroundColor={`${backgroundColor}`}
                        marginTop={`${marginTop}`}
                    >                        {
                            [...Array(numCol)].map((_, index) => (
                                <GridItem margin="0 5px 30px 0" border="1px solid #e4e4e4">
                                    <Skeleton height="250px" width="100%" key={index} />
                                    <Box padding="0.5rem 1rem .75rem">
                                        <Skeleton height={{ xxl: "20px", base: "18px" }} width="100%" marginBottom="0.625rem" key={index} />
                                        <Skeleton height={{ xxl: "20px", base: "18px" }} width="100%" marginRight="1rem" key={index} />
                                    </Box>
                                </GridItem>
                            ))}
                    </Grid>
    );
}

export default OrderOnlineSkeleton