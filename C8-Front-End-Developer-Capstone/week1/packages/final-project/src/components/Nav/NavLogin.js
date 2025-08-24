import { Box, Button, HStack, Image, List, ListItem, VStack, Text, useToast, ModalContextProvider } from "@chakra-ui/react";
import { HashLink } from "react-router-hash-link";
import { jwtDecode } from "jwt-decode";
import { lazy, useContext, useEffect, useRef, useState } from "react";
import { MealContext } from "../provider/MealContext.js"
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import client from "../provider/apollo-client.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { openDB } from 'idb';
import { apiClient } from '../provider/axiosInstanceWithTokenCheck.js';
import Cookies from 'js-cookie';
import useClickOutside from "../provider/useClickOutside.js";
import { ModalContext } from "../provider/ModalContext.js"
import { GlobalContext } from "../provider/GlobalModalContext.js";
import { Modal, ModalButton, ModalContent } from "../provider/ModalsSystem.js";
import navConfig from "./config/navConfig.js";
import LoginRotate from "../Register/LoginRotate.js";
import { useToken, useUserRotate } from "../provider/JwtTokenRotate.js";
import { useNavigate } from "react-router-dom";

// const LoginRotate = lazy(() => import("../Register/LoginRotate"))
const NavLogin = ({ setIsOpen }) => {
  const [showLogout, setShowLogout] = useState(false);
  const toast = useToast();
  const { lname, email, availableAccessToken, accessToken, isEmail } = useUserRotate();
  const { updateToken } = useToken();
  const navigate = useNavigate();
  const { modalOpen, setModalOpen, setLoadLogin } = useContext(ModalContext);
  const onLogout = async (e) => {
    if (accessToken) {
      try {
        let result = await apiClient.post("http://localhost:5000/logout/logout");
        if (result.status === 200) {
          localStorage.removeItem("accessToken");
          Cookies.remove('X-CSRF-Token');
          toast({ title: "Logged Out Successfully", status: "success", duration: 2000 });
          setTimeout(() => {
            // window.location.href = "/";
            navigate("/")
            updateToken()
          }, 2000);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("accessToken");
          Cookies.remove('X-CSRF-Token');
          console.log("Unauthorized - Logged Out");
        } else if (error.response && error.response.status === 400) {
          console.log(error.response);
        } else {
          console.error("Error:", error);
        }
      }
    }
  };


  //click outside and hide relative div
  const logoutRef = useRef();

  useClickOutside([logoutRef], () => {
    setShowLogout(false)
  })
  const { setModalState } = useContext(GlobalContext);
  if (availableAccessToken) {
    return (
      <Box height="auto" position="relative" ref={logoutRef} key="Login">
        <Text textStyle="StyledNav" onClick={() => setShowLogout(!showLogout)}>
          Hi {lname}
        </Text>
        <Box
          display={showLogout ? "block" : "none"}
          position="absolute"
          zIndex="100"
          backgroundColor="#fff"
          right="0"
          minWidth="150px"
          height="auto"
          border="1px solid #ccc"
          onClick={() => setShowLogout(!showLogout)}
        >
          <List>
            <ListItem onClick={() => {
              setIsOpen(false)
            }}>
              <HashLink to="/account">
                <Box textStyle="StyledNav" marginLeft="1rem"> My Page</Box>
              </HashLink>
            </ListItem>
            <ListItem onClick={() => {
              onLogout()
              setIsOpen(false)
            }}>
              <Box textStyle="StyledNav" marginLeft="1rem">Log Out</Box>
            </ListItem>
          </List>
        </Box>
      </Box>
    );
  }
  else {
    return (
      <>
        <Modal id="login">
          <ModalButton textStyle="StyledNav">
            LOGIN
          </ModalButton>
          <ModalContent>
            <LoginRotate />
          </ModalContent>
        </Modal>
      </>
    );
  }
}

export default NavLogin