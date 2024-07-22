import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export const MealContext = createContext();

export const useNumMeal = () => {
  return useContext(MealContext);
};

export const MealContextProvider = ({ children }) => {
  //set cart icon number
  const [cartItem, setCartItem] = useState(0)

  // Use a ref to track if cartItem has changed
  const cartItemChangedRef = useRef(false);
  const [prevItems, setPrevItems] = useState(cartItem)
  //if cart icon number change or dababase have no data
  if (cartItem !== prevItems ||!cartItem) {
    cartItemChangedRef.current = true;
  }
  return (
    <MealContext.Provider value={{ cartItem, setCartItem,cartItemChangedRef }}>
      {children}
    </MealContext.Provider>
  );
};
