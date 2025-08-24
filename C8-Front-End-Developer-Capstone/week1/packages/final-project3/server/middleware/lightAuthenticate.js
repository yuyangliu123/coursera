const {jwtDecode} = require('jwt-decode');

const lightAuthenticate = (req, res, next) => {
    const csrfHeader = req.headers["x-csrf-token"]
    const csrfToken = req.cookies["X-CSRF-Token"]

    if (!csrfHeader || !csrfToken) {
        return res.status(401).json('CSRF Token missing');
    }
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json('Access Token missing');
    }

    try {
        const email = jwtDecode(accessToken)?.email;
        req.user = { email }; // Only retrieve the email, without performing any other verification
        next();
    } catch (e) {
        console.error(`Light authentication error: ${e}`);
        res.status(500).json(`Something Went Wrong,${e}`);
    }
};

module.exports = lightAuthenticate;