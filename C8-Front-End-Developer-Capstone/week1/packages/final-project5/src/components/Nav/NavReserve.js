
import { Text } from "@chakra-ui/react";
import { useContext } from "react";
import { GlobalContext } from "../provider/GlobalModalContext";
import { ModalContext } from "../provider/ModalContext";

const NavReserve=()=>{
    const { modalState, setModalState } = useContext(GlobalContext);
    const { modalOpen, setModalOpen ,setLoadReserve} = useContext(ModalContext);
    return (
        <Text textStyle="StyledNav" onClick={() => {
            setModalOpen(!modalOpen)
            setModalState("reservation")
            setLoadReserve(true) //Dynamic Imports
            }}>
          RESERVATIONS
        </Text>
      )
}

export default NavReserve