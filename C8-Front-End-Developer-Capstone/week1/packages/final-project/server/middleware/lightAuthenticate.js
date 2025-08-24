const { jwtDecode } = require('jwt-decode');

const lightAuthenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const sessionId = req.cookies.sessionId; // 從 Cookie 讀取 sessionId
    const csrfHeader = req.headers["x-csrf-token"];
    const csrfToken = req.cookies["X-CSRF-Token"];

    // 1. 無論是否登錄，都附加 sessionId 到 req（供購物車等業務邏輯使用）
    req.sessionId = sessionId;

    // 2. 如果有 accessToken，解析 email（不驗證簽名和有效性）
    if (accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            req.user = { email: decoded.email }; // 僅附加 email，不驗證其他資訊

            // 3. 登錄狀態下強制檢查 CSRF
            if (!csrfHeader || !csrfToken || csrfHeader !== csrfToken) {
                return res.status(401).json('CSRF Token missing or mismatch');
            }
        } catch (e) {
            console.error(`Light authentication error: ${e}`);
            return res.status(401).json('Invalid Access Token format');
        }
    }

    // 4. 未登錄狀態不檢查 CSRF，直接放行
    next();
};

module.exports = lightAuthenticate;