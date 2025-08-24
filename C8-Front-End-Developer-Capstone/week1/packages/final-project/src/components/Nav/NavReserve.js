
import {Text } from "@chakra-ui/react";
import { lazy, useContext } from "react";
import { GlobalContext } from "../provider/GlobalModalContext";
import { ModalContext } from "../provider/ModalContext";
import { Modal, ModalButton, ModalContent } from "../provider/ModalsSystem.js";
import BookingForm from "../Booking/BookingForm.js";

// const BookingForm = lazy(() => import("../Booking/BookingForm"))

const NavReserve = () => {
  const { modalState, setModalState } = useContext(GlobalContext);
  const { modalOpen, setModalOpen, setLoadReserve } = useContext(ModalContext);

  return (
    // <Text textStyle="StyledNav" onClick={() => {
    //   setModalOpen(true)
    //   setModalState("reservation")
    //   setLoadReserve(true) //Dynamic Imports
    // }}>
    //   RESERVATIONS
    // </Text>
    <>
        <Modal id="reservation">
          <ModalButton textStyle="StyledNav">
            RESERVATIONS
          </ModalButton>
          <ModalContent>
            <BookingForm />
          </ModalContent>
        </Modal>
    </>
  )
}

export default NavReserve