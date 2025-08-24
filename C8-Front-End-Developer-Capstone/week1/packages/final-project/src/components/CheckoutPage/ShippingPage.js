import { Box, FormControl, HStack, Radio, RadioGroup, VStack } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"
import { useEffect } from "react"

const ShippingPage = ({ itemInfo }) => {
    const { register, handleSubmit, control, watch, trigger, formState: { errors, isValid }, setValue } = useFormContext()

    // 监听 shippingMethod 的变化，以便相应地更新 shippingFee
    const shippingMethod = watch("shippingMethod");
    const shippingFee=watch("shippingFee")
    console.log(shippingMethod,"shippingMethod",shippingFee,"shippingFee");
    
    // useEffect(() => {
    //     if (shippingMethod && itemInfo?.fee?.[shippingMethod]) {
    //         setValue("shippingFee", itemInfo.fee[shippingMethod]);
    //     }
    // }, [shippingMethod, itemInfo, setValue]);

    return (
        <>
            <VStack>
                <Box width="100%" as="h2" textStyle="StyledH2" color="black">
                    Shipping Method
                </Box>
                <FormControl isInvalid={!!errors.shippingMethod}>
                    <Controller
                        name="shippingMethod"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                onChange={(val) => {
                                    field.onChange(val);
                                    setValue("shippingFee", itemInfo.fee.fee[val]);
                                }}
                            >
                                {Object.entries(itemInfo.fee.fee).map(([key, value]) => (
                                    <Radio key={key} value={key} width="100%" height="3vh">
                                        <HStack>
                                            <Box fontSize="1.2em">
                                                {key}
                                            </Box>
                                            <Box>
                                                ${value}
                                            </Box>
                                        </HStack>
                                    </Radio>
                                ))}
                            </RadioGroup>
                        )}
                    />
                </FormControl>
            </VStack>
        </>
    )
}

export default ShippingPage