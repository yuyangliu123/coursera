import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import theme from '../../theme';
const FoodButton = ({ category, setMenu, menu, marginLeft,...props }) => {

  return (
    <Box
      alignSelf="start"
      marginLeft={marginLeft}
      width="100%"
      _hover={{ color: "#da1a32" }}
      textStyle="StyledNav"
      {...props}
    >
      {category}
    </Box>
  );
};


export default FoodButton;
