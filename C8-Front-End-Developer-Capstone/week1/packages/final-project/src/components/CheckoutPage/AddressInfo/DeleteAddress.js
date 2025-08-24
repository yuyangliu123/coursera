import { Box, Button, Heading, HStack, Stack, useToast } from "@chakra-ui/react"
import { useContext } from "react";
import { GlobalContext } from "../../provider/GlobalModalContext";
import { ModalContext } from "../../provider/ModalContext";
import { useUserRotate } from "../../provider/JwtTokenRotate";
import { apiClient } from "../../provider/axiosInstanceWithTokenCheck";
import { useFormContext } from "react-hook-form";
import { useModal } from "../../provider/ModalsSystem";

const DeleteAddress = ({ addressInfo }) => {
    const { setModalState } = useContext(GlobalContext);
    const {
        setModalOpen,
        // loadNewAddress,
        // setLoadNewAddress,
        setLoadDeleteAddress,
        // setOperateAddress,
        setAllAddressInfo,
    } = useContext(ModalContext);
    const { email } = useUserRotate();
    const toast = useToast();
    const { setValue } = useFormContext()
    const { closeModal } = useModal()

    const onDelete = async (data) => {
        // e.preventDefault();

        // 觸發特定欄位的驗證
        try {
            const requestBody = {
                ...data,
                email: email,
                state: "delete",
                uuid: addressInfo.uuid
            };
            const result = await apiClient.post("http://localhost:5000/checkout/checkoutInfo", requestBody);
            if (result.status === 200) {
                setAllAddressInfo((prev) => ({
                    ...prev,
                    shippingInfo: result.data.shippingInfo,
                    addressInfo: result.data.updatedAddress
                    // updatedAddress:result.data.updatedAddress //可能不需要
                }))
                setValue("selectedAddress", result.data.updatedAddress?.uuid)
                toast({ title: "delete", status: "success", duration: 2000 });
            }

        } catch (error) {
            console.error("Error:", error);
        }
        // toast({ title: "Add Address success", status: "success", duration: 2000 });
    }


    const handleDelete = () => {
        onDelete()
        closeModal()
        // setModalState("")
        // // setLoadNewAddress(!loadNewAddress)
        // setLoadDeleteAddress(false)
        // setModalOpen(false)
        // setOperateAddress("")
    }
    const handleCancel = () => {
        closeModal()
        // setModalState("")
        // setLoadDeleteAddress(false)
        // setModalOpen(false)
        // setOperateAddress("")
    }

    return (
        <>
            <Stack
                direction="column"
                marginBottom="2"
                justifyContent="center"
                alignItems="center"
            >
                <Box width="100%" justifyContent="start">
                    <Heading color="teal.400" fontSize="1.5em">Delete Address</Heading>
                </Box>
                <Box minW={{ base: "70%", md: "468px" }} margin="1vh 0">
                    Do you want to delete address({addressInfo.addressFname} {addressInfo.addressLname}, {addressInfo.address1} {addressInfo.address2}, {addressInfo.country})?
                </Box>
                <HStack width="100%" justifyContent="end">
                    <Button
                        backgroundColor="white"
                        color="#1773b0"
                        _hover={{ backgroundColor: "white" }}
                        onClick={() => {
                            handleCancel()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        backgroundColor="#dd1d1d"
                        color="#ffffff"
                        _hover={{ backgroundColor: "#cb1a1a" }}
                        onClick={() => {
                            handleDelete()
                        }}
                    >
                        Delete
                    </Button>
                </HStack>
            </Stack>
        </>
    )
}
export default DeleteAddress