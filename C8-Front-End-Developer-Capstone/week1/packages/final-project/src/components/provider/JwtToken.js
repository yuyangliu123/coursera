import { createContext, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
const TokenContext = createContext();

export const useToken = () => {
  return useContext(TokenContext);
};

export const TokenProvider = ({ children }) => {

  const checkTokenState = () => {
    // Simulate API call to check token
    const jwtToken = localStorage.getItem("token");
    const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
    const currentTime = Date.now() / 1000;
    const refreshDay = 7 * 60 * 60 * 24;
    const availableToken = decodedToken?.exp > currentTime;
    const refreshToken = decodedToken?.exp + refreshDay > currentTime;

    const createNewToken = async (fname, lname, email) => {
      try {
        // Make an API call to create a new token
        const result = await fetch("http://localhost:5000/login/create-token", {
          method: "POST",
          body: JSON.stringify({ fname, lname, email }),
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

    switch (true) {
      case availableToken:
        return {
          availableToken,
          jwtToken,
          fname: decodedToken.fname,
          lname: decodedToken.lname,
          email: decodedToken.email,
        };
      case refreshToken:
        createNewToken(decodedToken.fname, decodedToken.lname, decodedToken.email);
        break;
      default:
        localStorage.setItem("token", "");
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("DOMContentLoaded", checkTokenState);
    return () => {
      window.removeEventListener("DOMContentLoaded", checkTokenState);
    };
  }, []);

  return <TokenContext.Provider value={checkTokenState()}>{children}</TokenContext.Provider>;
};
