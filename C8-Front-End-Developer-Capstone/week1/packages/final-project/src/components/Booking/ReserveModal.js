import { useContext } from "react";
import ModalPage from "../provider/ModalPage"
import BookingForm from "./BookingForm";
import { GlobalContext } from "../provider/GlobalModalContext";

const ReserveModal = () => {
    const { reserveState } = useContext(GlobalContext)
    return (
        <>
            {/* <ModalPage> */}
                {
                    reserveState ? (

                        <BookingForm />

                    ) : null
                }
            {/* </ModalPage> */}
        </>
    )


}

export default ReserveModal