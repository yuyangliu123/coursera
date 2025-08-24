import React, { createContext, useState } from 'react';

export const ModalContext = createContext();


export const ModalContextProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [loadReserve, setLoadReserve] = useState(false)
  const [loadLogin, setLoadLogin] = useState(false)
  const [loadSignup, setLoadSignup] = useState(false)
  const [loadForgotPass, setLoadForgotPass] = useState(false)

  //prevent scroll when modal open
  document.body.style.overflow = modalOpen ? "hidden" : "unset"

  return (
    <ModalContext.Provider value={{
      modalOpen, setModalOpen,
      loadReserve, setLoadReserve,
      loadLogin, setLoadLogin,
      loadSignup, setLoadSignup,
      loadForgotPass, setLoadForgotPass
    }}>
      {children}
    </ModalContext.Provider>
  );
};