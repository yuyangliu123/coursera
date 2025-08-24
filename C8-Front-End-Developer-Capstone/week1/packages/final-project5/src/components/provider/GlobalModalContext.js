import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();
export const GlobalContextProvider = ({ children }) => {
  const [modalState, setModalState] = useState(null)
  return (
    <GlobalContext.Provider value={{ modalState, setModalState}}>
      {children}
    </GlobalContext.Provider>
  );
};

