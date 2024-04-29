import React, { createContext, useContext, useState, useEffect } from 'react';

const CapslockContext = createContext();

export const useCapslock = () => {
  return useContext(CapslockContext);
};

export const CapslockProvider = ({ children }) => {
  const [capslockState, setCapslockState] = useState(false);

  const checkCapslockState = (e) => {
    //Solve auto-fill problem, only if event's prototype == KeyboardEvent & event's key == CapsLock does capslockState been define.
    if((e instanceof KeyboardEvent) && (e.key=="CapsLock")){
    setCapslockState(e.getModifierState('CapsLock'));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', checkCapslockState);
    return () => window.removeEventListener('keydown', checkCapslockState);
  }, []);

  return (
    <CapslockContext.Provider value={capslockState}>
      {children}
    </CapslockContext.Provider>
  );
};
