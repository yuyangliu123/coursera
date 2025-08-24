import { Box, Button, HStack, Input, VStack } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const OrderSummaryPrice = ({ itemInfo }) => {
    const { register, handleSubmit, control, watch, trigger, formState: { errors, isValid }, setValue } = useFormContext()
const shippingFee=watch("shippingFee")
    return (
        <>
            <HStack width="100%" marginTop="1vh">
                <Input placeholder='PROMO CODE' backgroundColor="#ffffff" />
                <Button backgroundColor="#f5f5f5" border="1px solid #cfcfcf">
                    APPLY
                </Button>
            </HStack>
            <HStack
                width="100%"
                justifyContent="space-between"
            >
                <Box>
                    Subtotal {itemInfo?.cart?.checkedItem} {itemInfo?.cart?.checkedAmount > 1 ? `Items` : `Item`}
                </Box>
                <Box>
                    ${itemInfo?.cart?.checkedAmount}
                </Box>
            </HStack>
            <HStack
                width="100%"
                justifyContent="space-between"
            >
                <Box>
                    Shipping & handling
                </Box>
                <Box>
                    ${shippingFee}
                </Box>
            </HStack>
            <HStack
                width="100%"
                justifyContent="space-between"
            >
                <Box>
                    Order total
                </Box>
                <Box>
                    ${((Number(itemInfo?.cart?.checkedAmount ?? 0) + Number(shippingFee ?? 0))).toFixed(2)}
                </Box>
            </HStack>
        </>
    )
}

export default OrderSummaryPrice