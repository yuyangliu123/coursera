import { Box, HStack, Radio, RadioGroup, Text, FormControl, Popover, PopoverTrigger, PopoverContent, PopoverArrow } from '@chakra-ui/react';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import React, { lazy, useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import useClickOutside from '../../provider/useClickOutside';
import { Modal, ModalButton, ModalContent } from '../../provider/ModalsSystem';
import AddAddress from './AddAddress';
import DeleteAddress from './DeleteAddress';

// const AddAddress = lazy(() => import("./AddAddress"))
// const DeleteAddress = lazy(() => import("./DeleteAddress"))

const AddressInfo = ({ allAddressInfo }) => {
    const [editBox, setEditBox] = useState({})
    const { register, handleSubmit, control, watch, trigger, formState: { errors, isValid }, setValue } = useFormContext()




    const editBoxRef = useRef({})
    useEffect(() => {
        allAddressInfo.shippingInfo.forEach(address => {
            if (!editBoxRef.current[address.uuid]) {
                editBoxRef.current[address.uuid] = React.createRef();
            }
        });
    }, [allAddressInfo])
    const closeAllEditBox = () => {
        setEditBox(prev => {
            const newState = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false; // 將所有 editBox 設為 false
                return acc;
            }, {});
            return { ...newState };
        });
    }
    useClickOutside(editBoxRef, () => {
        closeAllEditBox()
    }
    );

    const [isOpen, setIsOpen] = useState({});

    const closePopover = (uuid) => {
        setIsOpen(prev => ({
            ...prev,
            [uuid]: false
        }));
    };

    const togglePopover = (uuid) => {
        setIsOpen(prev => ({
            ...prev,
            [uuid]: !prev[uuid]
        }));
    };
    return (
        <>
            <Box>
                <FormControl isInvalid={!!errors.selectedAddress}>
                    <Controller
                        name="selectedAddress"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                onChange={(val) => {
                                    field.onChange(val);
                                }}
                            >
                                {allAddressInfo.shippingInfo.map((address) => (
                                    <Box
                                        position="relative"
                                        borderRadius="8px"
                                        key={address.uuid}
                                        margin="2px"
                                        // padding="1rem"
                                        backgroundColor={address.uuid === field.value ? "#f0f5ff" : ""}
                                        _hover={{ backgroundColor: "#f0f5ff" }}
                                    >
                                        <HStack>
                                            <Radio
                                                value={address.uuid}
                                                width="100%"
                                                height="100%"
                                                padding="0.6rem"
                                            >
                                                <Box width="100%" paddingRight="5rem" onClick={() => {
                                                    closeAllEditBox()
                                                }}>
                                                    <Text fontSize="1em">{address.addressLname} {address.addressFname} {address.address1} {address.address2}</Text>
                                                    <HStack>

                                                        <Text fontSize="0.9em" opacity="0.8">{address.city} {address.country}</Text>
                                                        <Text
                                                            fontSize="0.9em"
                                                            backgroundColor="hsl(204, 64.80%, 67.60%)"
                                                            color="hsl(204, 100.00%, 20.00%)"
                                                            borderRadius="10%"
                                                        >
                                                            {address.isDefault ? "Default" : ""}
                                                        </Text>
                                                    </HStack>
                                                </Box>
                                            </Radio>
                                            <Popover
                                                isOpen={isOpen[address.uuid] || false}
                                                onClose={() => closePopover(address.uuid)}
                                            >
                                                <Box
                                                    position="absolute"
                                                    right="1vh"
                                                    display={address.uuid === field.value ? "block" : "none"}
                                                    width="2rem"
                                                >
                                                    <PopoverTrigger>
                                                        <FontAwesomeIcon
                                                            width="100%"
                                                            icon={faEllipsisVertical}
                                                            fontSize="1.5rem"
                                                            color='hsl(204,77%,39%)'
                                                            onClick={() => togglePopover(address.uuid)}
                                                        />
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        width="fit-content"
                                                        fontSize="1rem"
                                                    >
                                                        <PopoverArrow />
                                                        <Modal id="update">
                                                            <ModalButton>
                                                                Edit
                                                            </ModalButton>
                                                            <ModalContent>
                                                                <AddAddress operateAddress={"update"} addressInfo={address}/>
                                                            </ModalContent>
                                                        </Modal>
                                                        <Modal id="delete">
                                                            <ModalButton>
                                                                Delete
                                                            </ModalButton>
                                                            <ModalContent>
                                                                <DeleteAddress addressInfo={address}/>
                                                            </ModalContent>
                                                        </Modal>
                                                    </PopoverContent>
                                                </Box>
                                            </Popover>
                                        </HStack>

                                    </Box>

                                ))}

                            </RadioGroup>
                        )}
                    />
                </FormControl>
            </Box>
        </>
    )
}

export default AddressInfo