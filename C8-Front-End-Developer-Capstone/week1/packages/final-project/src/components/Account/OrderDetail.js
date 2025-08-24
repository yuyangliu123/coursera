import { Box, Button, Checkbox, HStack, Image, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useEffect, useState } from "react"
import { useUserRotate } from "../provider/JwtTokenRotate";
import LazyLoadImage from '../provider/LazyLoadImage';
import orderDetailConfig from './config/orderDetailConfig';



const OrderDetail = ({ initialData }) => {
    const [myOrder, setMyOrder] = useState([])
    const { fname, email, availableAccessToken } = useUserRotate();

    return (
        <>
            {/* <VStack alignItems="start">
        <Box>
          Order Number #{initialData.orderNumber}
        </Box>
        <Box>
          Order Date: {initialData.createdAt}
        </Box>

      </VStack> */}

            <VStack width="100%">
                {/* <CartPageHeading numItem={cartData.totalItem} /> */}
                <VStack
                    alignItems="start"
                    alignSelf="start"
                    textStyle="StyledText"
                    color="#000000">
                    <Box>
                        ORDER #{initialData.orderNumber}
                    </Box>
                    <Box>
                        ORDER DATE {new Date(initialData.createdAt).toLocaleDateString()}
                    </Box>
                </VStack>
                <VStack width="100%" alignItems="start" spacing={6}>
                    <Box width={{ xl: "75%", base: "100%" }}>
                        <Table display={{ md: "table", base: "block" }} width="100%">
                            <Thead display={{ md: "table-header-group", base: "none" }}>
                                <Tr>
                                    <Th colSpan={2}>Item</Th>
                                    <Th>Price</Th>
                                    <Th>Quantity</Th>
                                    <Th>Total</Th>
                                </Tr>
                            </Thead>
                            <Tbody display={{ md: "table-row-group", base: "block" }}>
                                {initialData.itemInfo.map((item, index) => (
                                    // <Checkbox>
                                    <Tr key={index}
                                        borderBottomWidth="1px"
                                        display={{ md: "table-row", base: "grid" }}
                                        gridTemplateAreas={{
                                            md: "none",
                                            sm: `
                                "img meal meal meal"
                                "img price quantity total"
                                `,
                                            base: `
                                    "img meal"
                                    "price price"
                                    "quantity quantity"
                                    "total total"
                                `
                                        }}
                                    >
                                        {/* <Td colSpan={1} gridArea={"check"} display={{ md: "table-cell", base: "block" }} paddingLeft="0" paddingRight="0" borderBottomWidth={{ md: "1px", base: "0" }}>
                                        <Box>
                                            <Checkbox
                                                key={index}
                                                isChecked={item.checked}
                                                onChange={(e) => handleCheckbox(item, e.target.checked)}
                                            ></Checkbox>
                                        </Box>
                                    </Td> */}
                                        <Td
                                            gridArea={"img"}
                                            display={{ md: "table-cell", base: "block" }}
                                            borderBottomWidth={{ md: "1px", base: "0" }}
                                            width={`${orderDetailConfig.orderImgWidth}px`}
                                            padding={{ md: "1.5rem", base: "0" }}
                                        >
                                            <Box width={`${orderDetailConfig.orderImgWidth}px`}>
                                                <LazyLoadImage
                                                    src={item.strMealThumb}
                                                    alt={item.strMeal}
                                                    width="auto"
                                                    imgWidth={orderDetailConfig.orderImgWidth}
                                                    auto="webp"
                                                    height={`${orderDetailConfig.orderImgWidth}px`}
                                                    objectFit="cover"
                                                />
                                            </Box>
                                        </Td>
                                        <Td
                                            colSpan={1}
                                            gridArea={"meal"}
                                            display={{ md: "table-cell", base: "flex" }}
                                            flexDirection="row"
                                            borderBottomWidth={{ md: "1px", base: "0" }}
                                            alignItems="center"
                                            paddingLeft="0"
                                            paddingRight="0"
                                        >
                                            <Box textStyle="StyledText" color="#333333">
                                                {item.strMeal}
                                            </Box>
                                            {/* <Button
                                            backgroundColor="#e5e5e5"
                                            borderRadius="50%"
                                            size="xs"
                                            //set meal number to 0
                                            //use async/await to prevent Race Condition
                                            onClick={() => handleChangeValue(item, 0)}
                                            display={{ md: "none", base: "block" }}
                                            marginLeft="1rem"
                                        ><SmallCloseIcon color="#757575" /></Button> */}
                                        </Td>
                                        <Td
                                            gridArea={"price"}
                                            display={{ md: "table-cell", base: "flex" }}
                                            flexDirection={{ md: "none", sm: "column", base: "row" }}
                                            borderBottomWidth={{ md: "1px", base: "0" }}
                                        >
                                            <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Price</Text>
                                            <Box>${item.baseAmount}</Box>
                                        </Td>
                                        <Td
                                            gridArea={"quantity"}
                                            borderBottomWidth={{ md: "1px", base: "0" }}
                                            display={{ md: "table-cell", base: "flex" }}
                                            flexDirection={{ md: "none", sm: "column", base: "row" }}
                                        >
                                            <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Quantity</Text>
                                            {/* <HStack>
                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                fontSize="1.5rem"
                                                size="md"
                                                //use async/await to prevent Race Condition
                                                onClick={() => {
                                                    handleChangeValue(item, item.numMeal - 1)
                                                }}>-</Button>
                                            <Input
                                                maxWidth="8vh"
                                                width="8vh"
                                                textAlign="center"
                                                value={inputValues[item.strMeal]}
                                                //can change the input number through typing, but the fetch will only be triggered on blur
                                                onChange={(e) => { handleInputChange(item, e.target.value) }}
                                                onBlur={(e) => handleChangeValue(item, Number(e.target.value))}
                                            />

                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                fontSize="1.5rem"
                                                size="md"
                                                //use async/await to prevent Race Condition
                                                onClick={() => handleChangeValue(item, item.numMeal + 1)}
                                            >+</Button>
                                        </HStack> */}
                                            <Box>
                                                {item.numMeal}
                                            </Box>
                                        </Td>
                                        <Td
                                            gridArea={"total"}
                                            display={{ md: "table-cell", base: "flex" }}
                                            flexDirection={{ md: "none", sm: "column", base: "row" }}
                                            borderBottomWidth={{ md: "1px", base: "0" }}
                                        >
                                            <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Total</Text>
                                            <HStack justifyContent={{ md: "right", base: "none" }}>
                                                <Box gridArea={"total"}>${Number((item.baseAmount * item.numMeal).toFixed(2))}</Box>
                                                {/* <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                size="xs"
                                                //set meal number to 0
                                                //use async/await to prevent Race Condition
                                                onClick={async () => {
                                                    await handleChangeValue(item, 0)
                                                    // await setIsUpdate(isUpdate + 1)
                                                }}
                                                gridArea={"delete"}
                                                display={{ md: "block", base: "none" }}
                                            ><SmallCloseIcon color="#757575" /></Button> */}
                                            </HStack>
                                        </Td>
                                    </Tr>
                                    // </Checkbox>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                    <Box width={{ xl: "25%", md: "50%", base: "100%" }}>
                        {/* <Table>
                            <Thead>
                                <Th>Order Summary</Th>
                                <Th>{cartData.checkedItem} {cartData.checkedItem > 1 ? `Items` : `Item`}</Th>
                            </Thead>
                        </Table> */}
                        <Table>
                            <Tbody>
                                <Tr>
                                    <Td>
                                        Subtotal
                                    </Td>
                                    <Td>
                                        {initialData.orderAmount}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                    Grand total
                                    </Td>
                                    <Td>

                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                        {/* <HStack justifyContent="space-between">
                            <Box>Subtotal</Box>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Box>Grand total</Box>
                        </HStack> */}
                        {/* <Button
                        color="#ffffff"
                        backgroundColor="#da1a32"
                        border="1px solid #da1a32"
                        width="100%"
                        marginTop="1vh"
                        _hover={{
                            color: "#da1a32",
                            backgroundColor: "#ffffff"
                        }}
                        onClick={(e) => [
                            !cartData?.data?.some(item => item.checked)
                                ? toast({
                                    title: "Please select at least one item for checkout.",
                                    status: "error",
                                    duration: 2000,
                                })
                                : window.location.href = "./checkout/#deliver"

                        ]}
                        disabled={!cartData?.data?.some(item => item.checked)}
                    >
                        CHECKOUT
                    </Button> */}
                    </Box>
                </VStack>
            </VStack>
        </>
    )
}
export default OrderDetail