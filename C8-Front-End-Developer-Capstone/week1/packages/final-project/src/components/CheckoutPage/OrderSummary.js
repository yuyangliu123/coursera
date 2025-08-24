import { Box, Button, HStack, Input, VStack } from "@chakra-ui/react"
import LazyLoadImage from "../provider/LazyLoadImage"

const OrderSummary = ({ itemInfo }) => {
    return (
        <>
            {itemInfo?.cart?.data?.map((item) => (
                <Box
                    width="100%"
                    marginBottom="1vh"
                >
                    <HStack
                    justifyContent="space-between"
                    fontSize="20px"
                    textStyle="StyledText"
                    color="#000000"
                    >
                        <HStack gap="1rem">
                            <Box position="relative">
                                <Box
                                    position="absolute"
                                    top="-0.7rem"
                                    right="-0.7rem"
                                    backgroundColor="hsl(0,0%,40%)"
                                    width="22px"
                                    height="22px"
                                    borderRadius="50%"
                                >
                                    <Box
                                        height="fit-content"
                                        width="fit-content"
                                        margin="auto"
                                        color="hsl(0,0%,96%)"
                                        fontSize="1rem"
                                    >
                                        {item.numMeal}
                                    </Box>
                                </Box>
                                <Box width="64px" height="64px">
                                    <LazyLoadImage
                                        src={item.strMealThumb}
                                        alt={item.strMeal}
                                        width="auto"
                                        imgWidth="64"
                                        auto="webp"
                                        height="64px"
                                        objectFit="cover"
                                    />
                                </Box>

                            </Box>
                            <Box>
                                {item.strMeal}
                            </Box>
                        </HStack>
                        <Box>
                            ${item.cartAmount}
                        </Box>
                    </HStack>
                </Box>
            ))}
        </>
    )
}

export default OrderSummary