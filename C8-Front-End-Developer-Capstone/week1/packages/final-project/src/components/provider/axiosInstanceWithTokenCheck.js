import axios from 'axios'
import axiosRetry from 'axios-retry'
import { v4 as uuidv4 } from "uuid"
import Cookies from "js-cookie"
import { jwtDecode } from 'jwt-decode'
import { checkRefreshToken } from './checkRefreshToken'
import { toast } from 'react-toastify'
import { getUpdateTokenFn } from './tokenUpdater'
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
    )
  }
}


const getOrCreateSessionId = () => {
  let sessionId = Cookies.get('sessionId');
  console.log(sessionId, "session");

  // if (!sessionId) {
  //   sessionId = uuidv4();
  //   console.log(sessionId, "sessionId");

  //   Cookies.set('sessionId', sessionId, {
  //     expires: 7,
  //     secure: true,    // 僅限 HTTPS
  //     sameSite: 'lax'  // 防範 CSRF
  //   });
  // }
  return sessionId;
};

export const axiosInstance = (accessToken = null) => {
  const sessionId = getOrCreateSessionId();
  console.log("get sessionId");

  let csrf_token = Cookies.get(`X-CSRF-Token`)
  if (!csrf_token) {
    csrf_token = uuidv4()
    Cookies.set('X-CSRF-Token', csrf_token, { secure: true, sameSite: 'strict' })
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": accessToken ? `Bearer ${accessToken}` : "",
    "X-CSRF-Token": `${csrf_token}`,
  }
  // if (accessToken) {
  //   headers["Authorization"] = accessToken ? `Bearer ${accessToken}` : ""
  // } else {
  //   console.log("create session id", sessionId);
  // }

  const instance = axios.create({
    baseURL: 'http://localhost:5000',
    headers,
    withCredentials: true,
    timeout: 5000
  })

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
    // onRetry: (retryCount, error, config) => {
    //   config.__retryCount = retryCount; // 传递重试计数
    //   const timestamp = new Date().toISOString();
    //   console.log(`${timestamp} ON\_RETRY: 網路不穩定，正在第${retryCount}次重试...`)
    //   console.log(error, "error");
    //   if (error.config['axios-retry'].retryCount === RETRY_CONFIG.retries) {
    //     console.log("final retry");
    //   }
    // },
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
        401: 'Unauthorized',
        403: '權限不足，請聯繫管理員',
        404: '請求資源不存在',
        408: '請求超時，請稍後再試',
        429: '請求過於頻繁，請稍後再試',
        500: '服務器內部錯誤，請聯繫管理員',
        502: '網路錯誤，請稍後再試',
        503: '服務不可用，請稍後再試',
        504: '網路超時，請稍後再試'
      };

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
  })

  // 添加响应拦截器处理401错误（token刷新）
  instance.interceptors.response.use(
    response => {
      // 成功響應處理
      console.log(`[Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data)

      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const errorMessage = error.response?.data?.message || error.message;

      // 記錄錯誤日誌
      console.error(`[Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      // 如果是401错误且未尝试过刷新token
      // if (error.response?.status === 401 && !originalRequest._retry) {
      //   originalRequest._retry = true

      //   // try {
      //   //   const newAccessToken = await checkRefreshToken(localStorage.getItem("accessToken"))
      //   //   if (newAccessToken) {
      //   //     localStorage.setItem("accessToken", newAccessToken)
      //   //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      //   //     return instance(originalRequest)
      //   //   }
      //   // } catch (refreshError) {
      //   //   window.location.href = '/#top';
      //   //   return Promise.reject(refreshError)
      //   // }
      // }

      // // 429 速率限制錯誤處理
      // if (error.response?.status === 429) {
      //   toast.warning(`請求過於頻繁，請稍後再試 (${error.response.headers['retry-after'] || 5}秒)`);
      // }

      // // 500 服務器錯誤
      // if (error.response?.status === 500) {
      //   toast.error('服務器內部錯誤，請聯繫管理員');
      // }

      // // 網絡錯誤
      // if (!error.response) {
      //   toast.error('網絡連接錯誤，請檢查您的網絡設置');
      // }

      return Promise.reject(error)
    }
  )

  return instance
}

export const axiosInstanceWithTokenCheck = async () => {
  let accessToken = localStorage.getItem("accessToken");

  // 如果沒有 accessToken，直接回傳不帶 token 的 axios 實例
  if (!accessToken) {
    console.log("axiosInstance: 沒有 token");
    return axiosInstance();
  }

  // 檢查 token 是否過期
  const decodedToken = jwtDecode(accessToken);
  if (decodedToken?.exp < Date.now() / 1000) {
    console.log("accessToken 已過期，嘗試刷新...");

    // 呼叫刷新 token 函式
    const newAccessToken = await checkRefreshToken(accessToken);
    const updateToken = getUpdateTokenFn();
    // 如果刷新失敗，直接終止並回傳
    if (!newAccessToken) {
      console.log("刷新 token 失敗");
      if (updateToken) {
        await updateToken(); // 呼叫 context 更新
      }
      return null;
    }

    // 刷新成功，更新 localStorage 和 state
    accessToken = newAccessToken;

    if (updateToken) {
      await updateToken(); // 呼叫 context 更新
    }

    console.log("token 刷新成功");
  }

  // 使用最新的 accessToken 回傳 axios 實例
  console.log("回傳帶有 token 的 axios 實例");
  return axiosInstance(accessToken);
};

/**
 * 這是一個統一的 API 客戶端，將所有 HTTP 方法封裝起來。
 * 呼叫時會自動檢查並刷新 token，並回傳伺服器響應。
 * 使用範例：
 * const result = await apiClient.post('/user', { name: 'John' });
 * const data = await apiClient.get('/posts/1');
 */
export const apiClient = {
  /**
   * 封裝 GET 請求。
   * @param {string} url - 請求的 URL
   * @param {object} [config] - Axios 請求配置
   * @returns {Promise<any>} - 伺服器回傳的 Promise 物件
   */
  get: async (url, config) => {
    const instance = await axiosInstanceWithTokenCheck();
    if (!instance) {
      throw new Error("無法取得有效的 axios 實例，可能 token 刷新失敗。");
    }
    return instance.get(url, config);
  },

  /**
   * 封裝 POST 請求。
   * @param {string} url - 請求的 URL
   * @param {object} [data] - 請求的資料
   * @param {object} [config] - Axios 請求配置
   * @returns {Promise<any>} - 伺服器回傳的 Promise 物件
   */
  post: async (url, data, config) => {
    const instance = await axiosInstanceWithTokenCheck();
    if (!instance) {
      throw new Error("無法取得有效的 axios 實例，可能 token 刷新失敗。");
    }
    return instance.post(url, data, config);
  },

  /**
   * 封裝 PUT 請求。
   * @param {string} url - 請求的 URL
   * @param {object} [data] - 請求的資料
   * @param {object} [config] - Axios 請求配置
   * @returns {Promise<any>} - 伺服器回傳的 Promise 物件
   */
  put: async (url, data, config) => {
    const instance = await axiosInstanceWithTokenCheck();
    if (!instance) {
      throw new Error("無法取得有效的 axios 實例，可能 token 刷新失敗。");
    }
    return instance.put(url, data, config);
  },

  /**
   * 封裝 PATCH 請求。
   * @param {string} url - 請求的 URL
   * @param {object} [data] - 請求的資料
   * @param {object} [config] - Axios 請求配置
   * @returns {Promise<any>} - 伺服器回傳的 Promise 物件
   */
  patch: async (url, data, config) => {
    const instance = await axiosInstanceWithTokenCheck();
    if (!instance) {
      throw new Error("無法取得有效的 axios 實例，可能 token 刷新失敗。");
    }
    return instance.patch(url, data, config);
  },

  /**
   * 封裝 DELETE 請求。
   * @param {string} url - 請求的 URL
   * @param {object} [config] - Axios 請求配置
   * @returns {Promise<any>} - 伺服器回傳的 Promise 物件
   */
  delete: async (url, config) => {
    const instance = await axiosInstanceWithTokenCheck();
    if (!instance) {
      throw new Error("無法取得有效的 axios 實例，可能 token 刷新失敗。");
    }
    return instance.delete(url, config);
  },
};
