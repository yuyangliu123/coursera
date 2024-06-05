import React, { createContext, useContext, useState, useEffect } from 'react';

export const MealContext= createContext();

export const useNumMeal = () => {
  return useContext(MealContext);
};

export const MealContextProvider = ({ children }) => {
  const [cartItem,setCartItem]=useState(0)
  return (
    <MealContext.Provider value={{cartItem,setCartItem}}>
      {children}
    </MealContext.Provider>
  );
};
