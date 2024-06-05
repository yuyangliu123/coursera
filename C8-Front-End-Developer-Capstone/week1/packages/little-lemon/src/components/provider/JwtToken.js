import { createContext, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
const TokenContext = createContext();
export const useToken = () => {
  return useContext(TokenContext);
};

const UserContext = createContext();
export const useUser = () => {
  return useContext(UserContext);
};

export const TokenProvider = ({ children }) => {

  const checkTokenState = () => {
    // Simulate API call to check token
  const jwtToken = localStorage.getItem("token");
  //if token exist, then checke it's condition and decide should refresh it or delete it
  if(jwtToken){
    const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
    const currentTime = Date.now() / 1000;
    const refreshDay = 7 * 60 * 60 * 24;
    const availableToken = decodedToken?.exp > currentTime;
    const refreshToken = decodedToken?.exp + refreshDay > currentTime;
    const nOfRelogin=5
    const relogin=Number(decodedToken.refreshTime)>nOfRelogin
    const createNewToken = async (fname, lname, email,refreshTime) => {
      try {
        // Make an API call to create a new token
        const result = await fetch("http://localhost:5000/login/create-token", {
          method: "POST",
          body: JSON.stringify({ fname, lname, email,refreshTime }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (result.status === 200) {
          const response = await result.json();
          localStorage.setItem("token", response.token);
          window.location.href = "./"; // Redirect to login page after signup
        } else if (result.status === 400) {
          console.log(await result.text()); // Set the server error message
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  //---------------------------------------------------------------------------//
  //If the token exists, fname and other variables will be defined;
  //otherwise (if not logged in or if the token has expired), fname will not be defined.

    if (relogin) {
      localStorage.setItem("token", "");
    }else if (availableToken) {
      const user = {
        availableToken:availableToken,
        jwtToken:jwtToken,
        fname: decodedToken.fname,
        lname: decodedToken.lname,
        email: decodedToken.email,
        refreshTime:decodedToken.refreshTime
      };
      return user; //export user object
    } else if (refreshToken) {
      createNewToken(decodedToken.fname, decodedToken.lname, decodedToken.email,decodedToken.refreshTime);
    } else {
      localStorage.setItem("token", "");
    }
  }
  //when jwtToken is null, return null object
  return {}
};
//---------------------------------------------------------------------------//
const user = checkTokenState();
  useEffect(() => {
    window.addEventListener("DOMContentLoaded", checkTokenState);
    return () => {
      window.removeEventListener("DOMContentLoaded", checkTokenState);
    };
  }, []);

  return (
    <TokenContext.Provider value={checkTokenState()}>
      <UserContext.Provider value={user}>
        {children}
      </UserContext.Provider>
    </TokenContext.Provider>
  );
};
