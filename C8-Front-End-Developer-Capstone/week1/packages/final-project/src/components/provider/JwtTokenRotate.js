import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from './axiosInstanceWithTokenCheck';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { checkRefreshToken } from "./checkRefreshToken";
import { setUpdateTokenFn } from "./tokenUpdater";
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
  const updateToken = useCallback(async () => {
    console.log("Manual token update triggered");
    const accessToken = localStorage.getItem("accessToken");
    const sessionId = Cookies.get('sessionId');
    let updatedUser = { ...userState };
    if (accessToken) {
      const decodedAccessToken = accessToken ? jwtDecode(accessToken) : null;
      const currentTime = Date.now() / 1000;
      const availableAccessToken = decodedAccessToken?.exp > currentTime;

      if (availableAccessToken) {
        updatedUser = {
          availableAccessToken: availableAccessToken,
          accessToken: accessToken,
          isEmail: true,
          fname: decodedAccessToken.fname,
          lname: decodedAccessToken.lname,
          identifier: decodedAccessToken.email,
        };

      } else if (!availableAccessToken) {
        console.log("at expire");
        const newAccessToken = await checkRefreshToken(accessToken);
        if (newAccessToken) {
          console.log(newAccessToken);
          const decodedNewAccessToken = jwtDecode(newAccessToken);
          updatedUser = {
            availableAccessToken: true,
            accessToken: accessToken,
            isEmail: true,
            fname: decodedNewAccessToken.fname,
            lname: decodedNewAccessToken.lname,
            identifier: decodedNewAccessToken.email,
          };
        }
      }
    } else if (!accessToken && sessionId) {
      updatedUser = {
        availableAccessToken: null,
        accessToken: null,
        isEmail: false,
        fname: null,
        lname: null,
        identifier: sessionId,
      };
    } else {
      updatedUser = {
        availableAccessToken: null,
        accessToken: null,
        isEmail: false,
        fname: null,
        lname: null,
        identifier: null,
      };

    }
    setUserState(updatedUser);
    return updatedUser;
  }, [userState]);
  const accessToken = localStorage.getItem("accessToken");
  const sessionId = Cookies.get('sessionId');
  //Immediately Invoked Asynchronous Function
  useEffect(() => {
    console.log("useUserRotate useeffect trigger");

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
            isEmail: true,
            fname: decodedAccessToken.fname,
            lname: decodedAccessToken.lname,
            identifier: decodedAccessToken.email,
          };
          setUserState(user);
          console.log("useUserRotate trigger");

        } else if (!availableAccessToken) {
          console.log("at expire");
          const newAccessToken = await checkRefreshToken(accessToken);
          if (newAccessToken) {
            console.log(newAccessToken);
            const decodedNewAccessToken = jwtDecode(newAccessToken);
            const user = {
              availableAccessToken: true,
              accessToken: accessToken,
              isEmail: true,
              fname: decodedNewAccessToken.fname,
              lname: decodedNewAccessToken.lname,
              identifier: decodedNewAccessToken.email,
            };
            setUserState(user);
          }
        }
      } else if (!accessToken && sessionId) {
        const user = {
          availableAccessToken: null,
          accessToken: null,
          isEmail: false,
          fname: null,
          lname: null,
          identifier: sessionId,
        };
        setUserState(user);
      } else {
        const user = {
          availableAccessToken: null,
          accessToken: null,
          isEmail: false,
          fname: null,
          lname: null,
          identifier: null,
        };
        setUserState(user);
      }
    })();
  }, [accessToken, sessionId]);

  useEffect(()=>{
    setUpdateTokenFn(updateToken)
  },[updateToken])

  return (
    <TokenContext.Provider value={{ ...userState, updateToken }}>
      <UserRotateContext.Provider value={{ ...userState, updateToken }}>
        {children}
      </UserRotateContext.Provider>
    </TokenContext.Provider>
  );
};
