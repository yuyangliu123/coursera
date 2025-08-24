import { Box, Button, Checkbox, FormControl, Heading, HStack, Input, InputGroup, Radio, RadioGroup, Stack, Text, useToast, VStack } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserRotate } from '../../provider/JwtTokenRotate';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, useFormContext } from 'react-hook-form';
import { ModalContext } from '../../provider/ModalContext';
import { GlobalContext } from '../../provider/GlobalModalContext';
import { apiClient } from '../../provider/axiosInstanceWithTokenCheck';
import { useModal } from '../../provider/ModalsSystem';
const AddAddress = ({ operateAddress, addressInfo, allAddress }) => {
    const location = useLocation();
    const toast = useToast();
    const { fname, lname, email, } = useUserRotate();
    const { closeModal } = useModal()
    const {
        setAllAddressInfo,
    } = useContext(ModalContext);
    const { setModalState } = useContext(GlobalContext);
    const schema = yup.object().shape({
        addressFname: yup.string().required("first name is required"),
        addressLname: yup.string().required("last name is required"),
        phone: yup.string()
        .required('Phone number is required') // 必填驗證
        .matches(/^[0-9]+$/, 'Phone number must contain only digits') // 確保只包含數字 (可選，但推薦)
        .min(8, 'Phone number must be at least 8 digits') // 最少位數，例如台灣通常 8-10 位
        .max(15, 'Phone number cannot exceed 15 digits'), // 最多位數，考慮國際電話號碼

        address1: yup.string().required('address is required'),
        address2: yup.string(),
        city: yup.string().required('city is required'),
        country: yup.string().required('country is required'),
        asDefault: yup.boolean()
    });
    const { setValue } = useFormContext()
    const { register, handleSubmit, control, watch, trigger, formState: { errors, isValid } } = useForm({
        // mode: 'onChange', // Real-time validation
        resolver: yupResolver(schema),
        defaultValues: {
            addressFname: operateAddress === "update" ? addressInfo.addressFname : fname,
            addressLname: operateAddress === "update" ? addressInfo.addressLname : lname,
            phone: operateAddress === "update" ? addressInfo.phone : '',
            address1: operateAddress === "update" ? addressInfo.address1 : '',
            address2: operateAddress === "update" ? addressInfo.address2 : '',
            city: operateAddress === "update" ? addressInfo.city : '',
            country: operateAddress === "update" ? addressInfo.country : '',
            asDefault: operateAddress === "create" && allAddress.length === 0
                ? true
                : operateAddress === "update"
                    ? addressInfo.isDefault
                    : false,
        },
        mode: 'onBlur'
    });

    // Monitor the Changes in Form Values
    const addressFname = watch("addressFname")
    const addressLname = watch("addressLname")
    const phone = watch('phone');
    const address1 = watch('address1');
    const address2 = watch('address2');

    const city = watch('city');
    const country = watch('country');
    const payment = watch('payment');
    const asDefault = watch("asDefault")


    const addressFnameRef = useRef()
    const addressLnameRef = useRef()
    const phoneRef = useRef();
    const address1Ref = useRef();
    const address2Ref = useRef();
    const cityRef = useRef();
    const countryRef = useRef();
    useEffect(() => {
        // Set a timer to check if the input value has been autofilled.
        const timer = setTimeout(() => {
            const refs = [addressFnameRef, addressLnameRef, phoneRef, address1Ref, address2Ref, cityRef, countryRef];
            const values = [addressFname, addressLname, phone, address1, address2, city, country];

            refs.forEach((ref, index) => {
                if (ref.current && ref.current.value !== values[index]) {
                    ref.current.value = values[index];
                }
            });
        }, 100);

        // Cleanup function will run when the component unmounts or when the dependencies of useEffect change.
        return () => clearTimeout(timer);
    }, [addressFname, addressLname, phone, address1, city, country]);

    const onSave = async (data) => {
        // e.preventDefault();

        // 觸發特定欄位的驗證
        const isValid = await trigger(['phone', 'address1', 'city', 'country']);
        if (isValid) {
            try {
                const requestBody = {
                    ...data,
                    email: email,
                    state: operateAddress === "create"
                        ? "create"
                        : operateAddress === "update"
                            ? "update"
                            : "",
                    uuid: addressInfo?.uuid || undefined
                };
                const result = await apiClient.post("http://localhost:5000/checkout/checkoutInfo", requestBody);
                if (result.status === 200) {
                    toast({
                        title: `Address ${operateAddress === "create"
                            ? 'added'
                            : operateAddress === "update"
                                ? 'updated'
                                : ""} successfully`,
                        status: "success",
                        duration: 2000
                    });
                }
                setAllAddressInfo((prev) => ({
                    ...prev,
                    shippingInfo: result.data.shippingInfo,
                    addressInfo: result.data.updatedAddress
                    // updatedAddress:result.data.updatedAddress //可能不需要
                }))
                setValue("selectedAddress", result.data.updatedAddress?.uuid)
                closeModal()
                // setshippingInfo(result.data)
            } catch (error) {
                console.error("Error:", error);
                toast({
                    title: "Error occurred",
                    description: error.message,
                    status: "error",
                    duration: 2000
                });
            }
        }
    }

    return (
        <>
            <Stack
                direction="column"
                marginBottom="2"
                justifyContent="center"
                alignItems="center"
            >
                <Heading color="teal.400">Welcome</Heading>
                <Box minW={{ base: "70%", md: "468px" }}>
                    <form onSubmit={handleSubmit(onSave)} style={{ width: '100%' }}>

                        <Stack id='addAddress' spacing={4} p="1rem" backgroundColor="white" boxShadow="md" width="100%">
                            <Stack direction={{ base: "column", md: "row" }}>
                                <FormControl>
                                    <InputGroup>
                                        <VStack width="100%">
                                            <Input
                                                type="text"
                                                name='addressFname'
                                                placeholder="First Name"
                                                width="100%"
                                                ref={addressFnameRef}
                                                {...register("addressFname")}
                                            />
                                            {errors.addressFname && <p>{errors.addressFname.message}</p>}
                                        </VStack>
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <InputGroup>
                                        <VStack width="100%">
                                            <Input
                                                type="text"
                                                name='addressLname'
                                                placeholder="Last Name"
                                                width="100%"
                                                ref={addressLnameRef}
                                                {...register("addressLname")}
                                            />
                                            {errors.addressLname && <p>{errors.addressLname.message}</p>}
                                        </VStack>
                                    </InputGroup>
                                </FormControl>
                            </Stack>
                            <FormControl>
                                <InputGroup>
                                    <VStack width="100%">
                                        <Input
                                            type="number"
                                            name='phone'
                                            placeholder="Contact number*"
                                            width="100%"
                                            ref={phoneRef}
                                            {...register("phone")}
                                        />
                                        {errors.phone && <p>{errors.phone.message}</p>}
                                    </VStack>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <VStack width="100%">
                                        <Input
                                            type="text"
                                            name='address1'
                                            placeholder="Address line 1*"
                                            width="100%"
                                            ref={address1Ref}
                                            {...register("address1")}
                                        />
                                        {errors.address1 && <p>{errors.address1.message}</p>}
                                    </VStack>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <VStack width="100%">
                                        <Input
                                            type="text"
                                            name='address1'
                                            placeholder="Address line 2"
                                            width="100%"
                                            ref={address1Ref}
                                            {...register("address2")}
                                        />
                                        {errors.address2 && <p>{errors.address2.message}</p>}
                                    </VStack>
                                </InputGroup>
                            </FormControl>
                            <Stack direction={{ base: "column", md: "row" }}>
                                <FormControl>
                                    <InputGroup>
                                        <VStack width="100%">
                                            <Input
                                                type="text"
                                                name='city'
                                                placeholder="Town/City"
                                                width="100%"
                                                ref={cityRef}
                                                {...register("city")}
                                            />
                                            {errors.city && <p>{errors.city.message}</p>}
                                        </VStack>
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <InputGroup>
                                        <VStack width="100%">
                                            <Input
                                                type="text"
                                                name='country'
                                                placeholder="County/State"
                                                width="100%"
                                                ref={countryRef}
                                                {...register("country")}
                                            />
                                            {errors.country && <p>{errors.country.message}</p>}
                                        </VStack>
                                    </InputGroup>
                                </FormControl>
                            </Stack>
                            <HStack
                                marginTop="1rem"
                                justifyContent="space-between"
                            >
                                <FormControl>
                                    <Checkbox
                                        id="default-address"
                                        {...register("asDefault")}
                                        disabled={
                                            operateAddress === "update" && addressInfo.isDefault
                                            || operateAddress === "create" && allAddress.length === 0}
                                    >
                                        Set As Default
                                    </Checkbox>
                                </FormControl>
                                <HStack>
                                    <Button onClick={() => {
                                        closeModal()
                                    }}>
                                        Cancel
                                    </Button>

                                    <Button type="submit"
                                    >
                                        Save
                                    </Button>
                                </HStack>
                            </HStack>
                            {/* </Link> */}
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </>
    )
}

export default AddAddress