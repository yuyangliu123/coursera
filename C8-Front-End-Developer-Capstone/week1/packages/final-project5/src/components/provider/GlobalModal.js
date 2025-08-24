import { lazy, Suspense, useContext } from "react";
import { GlobalContext } from "./GlobalModalContext";
import ModalPage from "./ModalPage"
// import LoginRotate from "../Register/LoginRotate"
// import Signup from "../Register/Signup";
// import ForgotPassword from "../Register/ForgotPassword";
import { ModalContext } from "./ModalContext";
// import BookingForm from "../Booking/BookingForm";

//Dynamic Imports
const BookingForm = lazy(() => import("../Booking/BookingForm"))
const LoginRotate = lazy(() => import("../Register/LoginRotate"))
const Signup = lazy(() => import("../Register/Signup"))
const ForgotPassword = lazy(() => import("../Register/ForgotPassword"))

const GlobalModal = () => {
    const { modalState } = useContext(GlobalContext);
    const { loadReserve, loadLogin, loadSignup, loadForgotPass } = useContext(ModalContext)
    return (
        <Suspense>
            <ModalPage>
                {modalState === "login" ? (
                    loadLogin && <LoginRotate />
                ) : modalState === "signup" ? (
                    loadSignup && <Signup />
                ) : modalState === "forgot" ? (
                    loadForgotPass && <ForgotPassword />
                ) : modalState === "reservation" ? (
                    loadReserve && <BookingForm />

                ) : null}
            </ModalPage>
        </Suspense>
    )


}

export default GlobalModal