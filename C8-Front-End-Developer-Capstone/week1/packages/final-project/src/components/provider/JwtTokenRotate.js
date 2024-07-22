import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {axiosInstance} from './axiosInstanceWithTokenCheck';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { checkRefreshToken } from "./checkRefreshToken";
const TokenContext = createContext();
export const useToken = () => {
  return useContext(TokenContext);
};

const UserRotateContext = createContext();
export const useUserRotate = () => {
  return useContext(UserRotateContext);
};



export const TokenRotateProvider = ({ children }) => {
  const [userState, setUserState] = useState({});

  const accessToken = localStorage.getItem("accessToken");
  //Immediately Invoked Asynchronous Function
  useEffect(() => {
    (async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const decodedAccessToken = accessToken ? jwtDecode(accessToken) : null;
        const currentTime = Date.now() / 1000;
        const availableAccessToken = decodedAccessToken?.exp > currentTime;

        if (availableAccessToken) {
          const user = {
            availableAccessToken: availableAccessToken,
            accessToken: accessToken,
            isUser: true,
            fname: decodedAccessToken.fname,
            lname: decodedAccessToken.lname,
            email: decodedAccessToken.email,
          };
          setUserState(user);
        } else if (!availableAccessToken) {
          console.log("at expire");
          const newAccessToken = await checkRefreshToken(accessToken);
          if (newAccessToken) {
            console.log(newAccessToken);
            const decodedNewAccessToken = jwtDecode(newAccessToken);
            const user = {
              availableAccessToken: true,
              accessToken: accessToken,
              isUser: true,
              fname: decodedNewAccessToken.fname,
              lname: decodedNewAccessToken.lname,
              email: decodedNewAccessToken.email,
            };
            setUserState(user);
          }
        }
      } else {
        const user = {
          availableAccessToken: null,
          accessToken: null,
          isUser: false,
          fname: null,
          lname: null,
          email: null,
        };
        setUserState(user);
      }
    })();
  }, [accessToken]);

  return (
    <TokenContext.Provider value={userState}>
      <UserRotateContext.Provider value={userState}>
        {children}
      </UserRotateContext.Provider>
    </TokenContext.Provider>
  );
};
