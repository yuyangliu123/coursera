import axios from 'axios'
import {v4 as uuidv4} from "uuid"
import Cookies from "js-cookie"
import {jwtDecode} from 'jwt-decode';
import { checkRefreshToken } from './checkRefreshToken';

export const axiosInstance = (accessToken) => {
  let csrf_token = Cookies.get(`X-CSRF-Token`);
  if (!csrf_token) {
    csrf_token = uuidv4();
    Cookies.set('X-CSRF-Token', csrf_token, { secure: true, sameSite: 'strict' });
  }

  return axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "X-CSRF-Token": `${csrf_token}`
    },
    withCredentials: true
  });
};


// Check if the access token has expired before sending the request
export const axiosInstanceWithTokenCheck = async () => {
  let accessToken = localStorage.getItem("accessToken");
  if (jwtDecode(accessToken)?.exp<Date.now()/1000) {
    accessToken = await checkRefreshToken(accessToken);
  }
  return axiosInstance(accessToken)
};



