import { Children, cloneElement, createContext, useContext, useEffect, useRef, useState } from "react";
import useClickOutside from "./useClickOutside";
import { Box, Button } from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { createPortal } from 'react-dom';
export const useModal = () => useContext(ModalContext);

// ModalsSystem.jsx
const ModalContext = createContext({
    isOpen: false,
    content: null,       // 當前顯示的內容
    openModal: (content) => { },  // 新增 content 參數
    closeModal: () => { },
    replaceContent: (content) => { } // 新增替換內容的方法
});

export const Modal = ({ children, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState(null);

    const openModal = (newContent) => {
        setContent(newContent || null);
        setIsOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setIsOpen(false);
        setContent(null);
        document.body.style.overflow = "unset";
    };

    const replaceContent = (newContent) => {
        setContent(newContent);
    };

    return (
        <Box position="static">
            <ModalContext.Provider value={{ isOpen, content, openModal, closeModal, replaceContent }}>
                {children}
            </ModalContext.Provider>
        </Box>
    );
};

export const ModalButton = ({ children, nest = false, targetContent, ...props }) => {
    const { openModal, replaceContent, isOpen } = useModal();

    const handleClick = () => {
        if (nest) {
            // 巢狀模式：替換當前模態內容
            setTimeout(() => {
                replaceContent(targetContent);
            }, 0);
        } else {
            // 普通模式：開啟新模態
            setTimeout(() => {
                openModal(targetContent);
            }, 0);
        }
    };

    return (
        <Box onClick={handleClick} {...props}>
            {children}
        </Box>
    );
};

// export const ModalClose = ({ children, ...props }) => {
//     const {  closeModal } = useModal();

//     return (
//         <Box onClick={() => closeModal()} {...props}>
//             {children}
//         </Box>
//     );
// };

export const ModalContent = ({ children, backgroundColor = "#ffffff" }) => {
    const { isOpen, content, closeModal } = useModal();
    const modalRef = useRef();

    useClickOutside([modalRef], () => {
        if (!isOpen) return;
        console.log(`outside ${modalRef}`);
        closeModal();
    });

    if (!isOpen) return null;

    return createPortal( //將children 渲染至 DOM 的不同部分 保持在最上層
        <Box
            position="fixed"  // 關鍵：使用 fixed 而非 absolute
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
                ref={modalRef}
            >
                <Box width="fit-content" marginLeft="auto">
                    <Button onClick={closeModal}>
                        <SmallCloseIcon />
                    </Button>
                </Box>
                {content || children}
            </Box>
        </Box>,
        document.body  // 渲染目標
    );
};