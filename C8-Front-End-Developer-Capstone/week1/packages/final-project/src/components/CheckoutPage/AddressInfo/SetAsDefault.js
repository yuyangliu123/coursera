import { Box, HStack, Radio, RadioGroup, Text, FormControl } from '@chakra-ui/react';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { ModalContext } from '../../provider/ModalContext';
import { GlobalContext } from '../../provider/GlobalModalContext';
import { useUserRotate } from '../../provider/JwtTokenRotate';
import { apiClient } from '../../provider/axiosInstanceWithTokenCheck';

const SetAsDefault = ({ address }) => {
    const {
        setModalOpen,
        setOperateAddress,
        setLoadAddAddress,
        setAllAddressInfo,
        setLoadDeleteAddress, } = useContext(ModalContext);
    const { setModalState } = useContext(GlobalContext);
    const [editBox, setEditBox] = useState({})
    const { register, handleSubmit, control, watch, trigger, formState: { errors, isValid }, setValue } = useFormContext()
    const { email } = useUserRotate();







    const handleSetDefault = async (address) => {
        // e.preventDefault();

        // 觸發特定欄位的驗證
        try {
            const requestBody = {
                ...address,
                email: email,
                state: "setDefault",
                uuid: address.uuid
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
    return (
        <>
            <Box onClick={() => {
                handleSetDefault(address)
            }}>
                Set As Default
            </Box>
        </>
    )
}

export default SetAsDefault