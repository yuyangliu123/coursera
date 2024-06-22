
// To connect with mongoDB database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'little-lemon',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to little-lemon database');
}).catch((err) => {
    console.log(err);
});
// Schema for tokens of app
const UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
});
let User;
try {
    User = mongoose.model('sign-up-data');
} catch (error) {
    User = mongoose.model('sign-up-data', UserSchema);
}

User.createIndexes();


const RefreshSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d', // 這個令牌將在1天後自動從數據庫中刪除
    },
});
let RefreshToken;
try {
    RefreshToken = mongoose.model('RefreshToken');
} catch (error) {
    RefreshToken = mongoose.model('RefreshToken', RefreshSchema);
}

RefreshToken.createIndexes();
// For backend and express
const express = require('express');
const cookieParser = require('cookie-parser');
const login2 = express();
const cors = require("cors");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const uuid = require("uuid")
require("dotenv").config()
const SECRET_KEY = process.env.SECRET_KEY;
const { string } = require('yup');
const { jwtDecode } = require('jwt-decode');
console.log("App listen at port 5000");
login2.use(express.json());

//set sign of cookie
login2.use(cookieParser())
const corsOptions = {
    origin: 'http://localhost:3000', // Change to frontend's URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
login2.use(cors(corsOptions));
login2.get("/", (req, resp) => {

    resp.send("App is Working");
    // Can check backend is working or not by
    // entering http://localhost:5000
    // If you see App is working means
    // backend working properly
});

const createJwtToken = (fname, lname, email, expiresIn) => {
    const payload = {
        fname: fname,
        lname: lname,
        email: email,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
    return token;
};

// This route handler processes user login requests for the '/login2' path.
login2.post("/login2", async (req, resp) => {
    try {
        // Find a user instance with the email from the request body.
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            // Check if the password matches.
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (validPassword) {
                // Create a JWT token with a longer expiration (1 days)
                const accessToken = createJwtToken(user.fname, user.lname, req.body.email, "3s");
                const refreshToken = createJwtToken(user.fname, user.lname, req.body.email, "1d");
                // Assume that if the user manually deletes the rt (refresh token), then after a normal login,
                // it will directly update the rt part. Otherwise, it will create a new database
                const sameUser = await RefreshToken.findOne({ email: req.body.email })
                if (sameUser) {
                    await RefreshToken.findOneAndUpdate({ email: req.body.email }, { refreshToken: refreshToken })
                } else {
                    const newToken = new RefreshToken({
                        email: user.email,
                        refreshToken: refreshToken
                    });
                    // Asynchronously save the new user to the database.
                    let result = await newToken.save();
                    // Convert the Mongoose document object to a plain JavaScript object.
                    result = result.toObject();
                    // Delete the password property from the result object before sending it back to the client.
                    delete result.password;
                    // Log the saved user object to the server's console.
                    console.log(result);
                }
                // Set HTTP-only cookies for the access and refresh tokens
                // This cookies are sent to the client and used for authentication in future requests
                resp.cookie('refreshToken', refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'Lax' });
                resp.status(200).send({ state: true, name: user.fname, accessToken });
            } else {
                // If the password does not match, send an error message.
                resp.status(400).send("Invalid password");
            }
        } else {
            // If the user does not exist, send an error message.
            resp.status(400).send("User does not exist");
        }
    } catch (e) {
        resp.status(400).send(`Something Went Wrong, ${e}`);
    }
});

// This route handler processes user login requests for the '/login2' path.


login2.post('/check-refresh-token', async (req, resp) => {
    if (req.body.state === "ok") {
        try {
            // Validate user data (e.g., check if email exists)
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                const refreshtoken = await RefreshToken.findOne({ email: req.body.email });
                const refreshTokenCookie = req.cookies.refreshToken;

                if (!refreshTokenCookie) {
                    resp.clearCookie("refreshToken");
                    return resp.status(401).send("No refresh token cookie found");
                }

                try {
                    const availableRefreshToken = jwtDecode(refreshTokenCookie)?.exp > (Date.now() / 1000);
                    const sameToken = refreshtoken && refreshtoken.refreshToken === refreshTokenCookie;

                    if (sameToken && availableRefreshToken) {
                        // delete old token in storage
                        await RefreshToken.deleteOne({ refreshToken: refreshTokenCookie });

                        const accessToken = createJwtToken(req.body.fname, req.body.lname, req.body.email, '3s');
                        const newRefreshToken = createJwtToken(req.body.fname, req.body.lname, req.body.email, '1d');
                        const newToken = new RefreshToken({
                            email: req.body.email,
                            refreshToken: newRefreshToken
                        });

                        // Save the new refresh token to the database
                        await newToken.save();

                        // Set HTTP-only cookies for the new refresh token
                        resp.cookie('refreshToken', newRefreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'Lax' });

                        // Respond with the new access token
                        return resp.status(200).json({ accessToken });
                    } else {
                        // If the refresh token is invalid or expired, clear the cookie and delete from storage
                        await RefreshToken.deleteOne({ refreshToken: refreshtoken.refreshToken });
                        resp.clearCookie("refreshToken");
                        return resp.status(400).send("Not same token or token expired");
                    }
                } catch (error) {
                    resp.clearCookie("refreshToken");
                    return resp.status(400).send("Invalid token specified: must be a string");
                }
            } else {
                // If the user does not exist, clear the cookie and send an error message
                resp.clearCookie("refreshToken");
                return resp.status(401).send("User does not exist");
            }
        } catch (error) {
            return resp.status(400).json({ error: error.message });
        }
    } else {
        return resp.status(400).send("Invalid state");
    }
});



module.exports = login2;
