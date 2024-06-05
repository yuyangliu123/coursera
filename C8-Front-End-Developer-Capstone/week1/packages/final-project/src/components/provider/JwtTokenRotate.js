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
  const [userState, setUserState] = useState({});  //important
//---------------------------------------------------------------------------//
const checkRefreshToken = async (fname, lname, email, refreshToken) => {
  try {
    const result = await fetch("http://localhost:5000/login2/check-refresh-token", {
      method: "POST",
      body: JSON.stringify({ fname, lname, email, refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.ok) {
      throw new Error(`Server responded with status code ${result.status}`);
    }
    const response = await result.json();
    if (result.status === 200) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return response.accessToken; // return new access token
    } else if (result.status === 400 || result.status === 401) {
      console.log(await result.text()); // Set the server error message
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  } catch (error) {
    console.error("Error:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
//---------------------------------------------------------------------------//



//---------------------------------------------------------------------------//
const refreshToken= localStorage.getItem("refreshToken");
//Immediately Invoked Asynchronous Function
useEffect(() => {
  (async () => {
// Simulate API call to check token
    // Simulate API call to check token
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken= localStorage.getItem("refreshToken");
    if(accessToken || refreshToken){
    const decodedAccessToken = accessToken ? jwtDecode(accessToken) : null;
    const decodedRefreshToken = refreshToken ? jwtDecode(refreshToken) : null;
    const currentTime = Date.now() / 1000;
    const availableAccessToken = decodedAccessToken?.exp > currentTime;
    const availableRefreshToken = decodedRefreshToken?.exp > currentTime;
  //---------------------------------------------------------------------------//
  //If the token exists, fname and other variables will be defined;
  //otherwise (if not logged in or if the token has expired), fname will not be defined.
  if (availableAccessToken) {
    const user={
      availableAccessToken:availableAccessToken,
      fname: decodedAccessToken.fname,
      lname: decodedAccessToken.lname,
      email: decodedAccessToken.email,
    }
    setUserState(user)
  } else if (!availableAccessToken && availableRefreshToken) {
    const newAccessToken = await checkRefreshToken(
      decodedRefreshToken.fname,
      decodedRefreshToken.lname,
      decodedRefreshToken.email,
      refreshToken
    );
    if (newAccessToken) {
      const decodedNewAccessToken = jwtDecode(newAccessToken);
      const user={
        availableAccessToken: true,
        fname: decodedNewAccessToken.fname,
        lname: decodedNewAccessToken.lname,
        email: decodedNewAccessToken.email,
      }
      setUserState(user)
    }
  }  else{
      localStorage.setItem("accessToken", " ");
      localStorage.setItem("refreshToken", " ");
      setUserState({})
      return
    }
  }

})();
}, [refreshToken]);

  return (
    <TokenContext.Provider value={userState}>
      <UserRotateContext.Provider value={userState}>
        {children}
      </UserRotateContext.Provider>
    </TokenContext.Provider>
  );
};
