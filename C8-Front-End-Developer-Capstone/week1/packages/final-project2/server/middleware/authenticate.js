const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../model/models');

const authenticate = async (req, resp, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!accessToken || !refreshTokenCookie) {
        return resp.status(401).json('Access Token or Refresh Token missing');
    }

    const csrfHeader = req.headers["x-csrf-token"];
    const csrfToken = req.cookies["X-CSRF-Token"];

    if (!csrfHeader || !csrfToken) {
        return resp.status(401).json('CSRF Token missing');
    }

    try {
        const secretKey = process.env.SECRET_KEY;
        const decoded = jwt.verify(accessToken, secretKey);
        const email = decoded.email;

        const [user, refreshTokenDoc] = await Promise.all([
            User.findOne({ email: email }),
            RefreshToken.findOne({ email: email })
        ]);

        if (!user) {
            return resp.status(401).json('User does not exist');
        }

        // 檢查 CSRF token
        if (csrfHeader !== csrfToken) {
            return resp.status(401).json('CSRF Token mismatch');
        }

        if (!refreshTokenDoc) {
            return resp.status(401).json('Invalid Refresh Token');
        }

        const sameAccessToken = refreshTokenDoc.accessToken === accessToken;
        const sameRefreshToken = refreshTokenDoc.refreshToken === refreshTokenCookie;

        if (!sameAccessToken || !sameRefreshToken) {
            return resp.status(401).json("Invalid access or refresh token");
        }

        // 將用戶信息添加到請求對象中以供後續中間件或路由處理器使用
        req.user = user;
        next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            req.tokenExpired = true;
            next();
        } else {
            console.error(`Authentication error: ${e.message}`);
            resp.clearCookie("refreshToken");
            if (e.name === 'JsonWebTokenError') {
                return resp.status(401).json('Invalid Access Token');
            } else {
                return resp.status(500).json('Internal Server Error');
            }
        }
    }
};

module.exports = authenticate;
