import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FoodButton = ({ category, setMenu, menu }) => {
  const navigate = useNavigate();
  const handleClick = () => {
        navigate({
          pathname: '/order',
          search: `?category=${category}`,
        });
  };

  return (
    <button onClick={handleClick}>
      {category}
    </button>
  );
};


export default FoodButton;
