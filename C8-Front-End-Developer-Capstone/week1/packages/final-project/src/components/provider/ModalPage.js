import { SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import { useContext, useRef } from "react";
import useClickOutside from "./useClickOutside";
import { ModalContext } from "./ModalContext";
import { GlobalContext } from "./GlobalModalContext";

const ModalPage = ({ children, backgroundColor = "#ffffff" }) => {
    const { modalOpen, setModalOpen, setLoadNewAddress, setLoadAddAddress, setOperateAddress } = useContext(ModalContext);
    const { modalState } = useContext(GlobalContext);
    const closeRef = useRef();

    useClickOutside([closeRef], () => {
        console.log('useClickOutside triggered - current modalOpen:', modalOpen);
        if (!modalOpen) return; // 防護邏輯

        setModalOpen(false);
        if (modalState === "addaddress") {
            setLoadAddAddress(false);
            setOperateAddress("")
        } else if (modalState === "deleteaddress") {
            setOperateAddress("")
        }
    });

    const handleModalOpen = (isOpen) => {
        setModalOpen(isOpen);
    };

    return (
        <>
            {modalOpen ? (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    backgroundColor="rgba(0, 0, 0, 0.5)"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    zIndex="1000"
                >
                    <Box
                        position="relative"
                        margin="auto 0"
                        backgroundColor={backgroundColor}
                        padding="20px"
                        borderRadius="10px"
                        zIndex="100"
                        ref={closeRef}
                    >
                        <Box width="fit-content" marginLeft="auto">
                            <Button
                                backgroundColor="#ffffff"
                                onClick={() => {
                                    handleModalOpen(false)
                                }}
                            >
                                <SmallCloseIcon />
                            </Button>
                        </Box>
                        {children}
                    </Box>
                </Box>
            ) : null}
        </>
    );
};

export default ModalPage;
