import React, { createContext, useState } from 'react';

export const ModalContext = createContext();


export const ModalContextProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [operateAddress, setOperateAddress] = useState("")
  const [loadReserve, setLoadReserve] = useState(false)
  const [loadLogin, setLoadLogin] = useState(false)
  const [loadSignup, setLoadSignup] = useState(false)
  const [loadForgotPass, setLoadForgotPass] = useState(false)
  // const [loadNewAddress, setLoadNewAddress] = useState(false)
  const [loadAddAddress, setLoadAddAddress] = useState(false)
  const [loadDeleteAddress, setLoadDeleteAddress] = useState(false)
  const [allAddressInfo, setAllAddressInfo] = useState({ addressInfo: "", shippingInfo: [], updatedAddress: "" });
  //prevent scroll when modal open
  document.body.style.overflow = modalOpen ? "hidden" : "unset"

  return (
    <ModalContext.Provider value={{
      modalOpen, setModalOpen,
      operateAddress, setOperateAddress,
      loadReserve, setLoadReserve,
      loadLogin, setLoadLogin,
      loadSignup, setLoadSignup,
      loadForgotPass, setLoadForgotPass,
      // loadNewAddress, setLoadNewAddress,
      loadAddAddress, setLoadAddAddress,
      loadDeleteAddress, setLoadDeleteAddress,
      allAddressInfo, setAllAddressInfo
    }}>
      {children}
    </ModalContext.Provider>
  );
};