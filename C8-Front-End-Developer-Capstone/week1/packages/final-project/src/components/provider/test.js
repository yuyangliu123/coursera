import axios from 'axios';
import axiosRetry from 'axios-retry';
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { checkRefreshToken } from './checkRefreshToken';
import { toast } from 'react-toastify';
// import { useToken } from './JwtTokenRotate'; // 不再直接在這裡使用 useToken

// 重试配置
const RETRY_CONFIG = {
  retries: 2, // 建議增加到 2-3 次，1 次重試可能不足
  retryDelay: (retryCount) => {
    const baseDelay = Math.pow(2, retryCount) * 1000;
    const cappedDelay = Math.min(baseDelay, 10000); // 增加到 10 秒上限
    const jitter = cappedDelay * 0.3 * (Math.random() - 0.5);
    return Math.max(500, cappedDelay + jitter); // 確保最小延遲 500ms
  },
  retryCondition: (error) => {
    // 添加更具體的條件判斷
    if (error.response) {
      // 對於 429 狀態碼，檢查 Retry-After 頭部
      if (error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 1;
        return retryAfter * 1000; // 返回服務器建議的等待時間
      }
      // 對於 503 服務不可用，檢查 Retry-After
      if (error.response.status === 503) {
        const retryAfter = error.response.headers['retry-after'] || 5;
        return retryAfter * 1000;
      }
    }
    return (
      axiosRetry.isNetworkError(error) ||
      axiosRetry.isRetryableError(error) ||
      error.code === 'ECONNABORTED' ||
      (!error.response ||
        [401, 408, 429, 500, 502, 503, 504].includes(error.response.status))
    );
  }
};

const getOrCreateSessionId = () => {
  let sessionId = Cookies.get('sessionId');
  console.log(sessionId, "session");
  return sessionId;
};

// 修改 axiosInstance 函數，使其可以接收一個 onAuthErrorCallback 參數
export const axiosInstance = (accessToken = null, onAuthErrorCallback = null) => {
  console.log("axiosInstance trigger------------------------------------");

  const sessionId = getOrCreateSessionId();

  let csrf_token = Cookies.get(`X-CSRF-Token`);
  if (!csrf_token) {
    csrf_token = uuidv4();
    Cookies.set('X-CSRF-Token', csrf_token, { secure: true, sameSite: 'strict' });
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": accessToken ? `Bearer ${accessToken}` : "",
    "X-CSRF-Token": `${csrf_token}`,
  };

  const instance = axios.create({
    baseURL: 'http://localhost:5000',
    headers,
    withCredentials: true,
    timeout: 5000
  });

  instance.interceptors.request.use(config => {
    // 添加請求日誌
    console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`, config.data);

    // 動態調整超時時間
    if (config.__retryCount !== undefined) {
      config.timeout = Math.min(2000 * (config.__retryCount + 1), 20000); // 最大 20 秒
    }

    // 對於上傳/下載請求，設置不同的超時
    if (config.data instanceof FormData) {
      config.timeout = 30000; // 文件上傳設置 30 秒超時
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  }, error => {
    // 請求發送前的錯誤處理
    console.error('[Request Error]', error);
    return Promise.reject(error);
  });

  // 设置axios-retry
  axiosRetry(instance, {
    ...RETRY_CONFIG,
    shouldResetTimeout: true, // 确保每次重试都有完整的超时期限
    onMaxRetryTimesExceeded: (error, retryCount) => {
      console.log(error, retryCount, "onMaxRetryTimesExceeded", error.response?.status, error.response?.status === 401);
      console.log(error, "final error after retries");

      if (!error.response) {
        // 没有response的情况（如网络错误）
        toast.error('網絡連接錯誤，請檢查您的網絡設置', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }

      const status = error.response.status;
      const errorMessages = {
        401: 'Unauthorized', // 這裡的 401 錯誤將被 onAuthErrorCallback 處理
        403: '權限不足，請聯繫管理員',
        404: '請求資源不存在',
        408: '請求超時，請稍後再試',
        429: '請求過於頻繁，請稍後再試',
        500: '服務器內部錯誤，請聯繫管理員',
        502: '網路錯誤，請稍後再試',
        503: '服務不可用，請稍後再試',
        504: '網路超時，請稍後再試'
      };

      // 如果是 401 錯誤，並且提供了 onAuthErrorCallback，則呼叫它
      if (status === 401 && onAuthErrorCallback) {
        console.log("Calling onAuthErrorCallback for 401 status.");
        onAuthErrorCallback();
        return; // 避免顯示通用的 401 錯誤訊息
      }

      const message = errorMessages[status] || 'something went wrong';

      toast.error(message, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  });

  // 添加响应拦截器处理401错误（token刷新）
  instance.interceptors.response.use(
    response => {
      // 成功響應處理
      console.log(`[Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
      return response;
    },
    async (error) => {
      // 記錄錯誤日誌
      console.error(`[Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
      // 這裡不再處理 401 錯誤，因為 onMaxRetryTimesExceeded 會處理重試後的最終 401
      return Promise.reject(error);
    }
  );

  return instance;
};

// 保持 axiosInstanceWithTokenCheck 不變，但它可能不再是獲取實例的主要方式
export const axiosInstanceWithTokenCheck = async () => {
  let accessToken = localStorage.getItem("accessToken");
  console.log(accessToken, "accessToken");
  if (accessToken) {
    console.log("axiosInstanceWithTokenCheck");
    if (jwtDecode(accessToken)?.exp < Date.now() / 1000) {
      accessToken = await checkRefreshToken(accessToken);
    }
    return axiosInstance(accessToken);
  } else {
    console.log("axiosInstance");
    return axiosInstance();
  }
};
