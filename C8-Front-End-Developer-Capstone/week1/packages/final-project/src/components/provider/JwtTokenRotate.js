import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
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

  const checkRefreshToken = async (state,fname, lname, email) => {
    try {
      const result = await fetch("http://localhost:5000/login2/check-refresh-token", {
        method: "POST",
        body: JSON.stringify({state, fname, lname, email}),
        credentials:"include", // Allow credentials (cookies, authorization headers, etc.)
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!result.ok) {
        throw new Error(`Server responded with status code ${result.status}`);
      }
      const response = await result.json();
      if (result.status === 200) {
        //set at & rt to local storage
        localStorage.setItem("accessToken", response.accessToken);
        return response.accessToken; // Return the new access token
      } else if (result.status === 400 || result.status === 401) {
        console.log(await result.text());
        localStorage.removeItem("accessToken");
        return null; // Return null if there's an error
      }
    } catch (error) {
      console.error("Error:", error);
      localStorage.removeItem("accessToken");
      return null; // Return null if there's an exception
    }
  };

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
            accessToken:accessToken,
            fname: decodedAccessToken.fname,
            lname: decodedAccessToken.lname,
            email: decodedAccessToken.email,
          };
          setUserState(user);
        } else if (!availableAccessToken) {
          console.log("at expire");
          const newAccessToken = await checkRefreshToken(
            "ok",
            decodedAccessToken.fname,
            decodedAccessToken.lname,
            decodedAccessToken.email,
          );
          if (newAccessToken) {
            console.log(newAccessToken);
            const decodedNewAccessToken = jwtDecode(newAccessToken);
            const user = {
              availableAccessToken: true,
              accessToken:accessToken,
              fname: decodedNewAccessToken.fname,
              lname: decodedNewAccessToken.lname,
              email: decodedNewAccessToken.email,
            };
            setUserState(user);
          }
         }
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
