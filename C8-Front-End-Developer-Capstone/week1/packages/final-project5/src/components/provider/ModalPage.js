import { SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import { useContext, useRef } from "react";
import useClickOutside from "./useClickOutside";
import { ModalContext } from "./ModalContext";

const ModalPage = ({ children,backgroundColor = "#ffffff" }) => {
    const { modalOpen, setModalOpen } = useContext(ModalContext);
    const closeRef = useRef();

    useClickOutside([closeRef], () => {
        setModalOpen(false);
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
