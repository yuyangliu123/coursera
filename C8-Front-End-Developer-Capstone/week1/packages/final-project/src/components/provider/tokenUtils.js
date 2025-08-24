import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { checkRefreshToken } from "./checkRefreshToken";

export const updateToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const sessionId = Cookies.get("sessionId");
  let user = {};

  if (accessToken) {
    const decodedAccessToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    const availableAccessToken = decodedAccessToken?.exp > currentTime;

    if (availableAccessToken) {
      user = {
        availableAccessToken: true,
        accessToken,
        isEmail: true,
        fname: decodedAccessToken.fname,
        lname: decodedAccessToken.lname,
        identifier: decodedAccessToken.email,
      };
    } else {
      const newAccessToken = await checkRefreshToken(accessToken);
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken); // 更新 localStorage
        const decodedNewToken = jwtDecode(newAccessToken);
        user = {
          availableAccessToken: true,
          accessToken: newAccessToken,
          isEmail: true,
          fname: decodedNewToken.fname,
          lname: decodedNewToken.lname,
          identifier: decodedNewToken.email,
        };
      }
    }
  } else if (!accessToken && sessionId) {
    user = {
      availableAccessToken: null,
      accessToken: null,
      isEmail: false,
      fname: null,
      lname: null,
      identifier: sessionId,
    };
  }

  return user;
};
