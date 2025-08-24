//--------------------------------------------------------------------------------------------------//
// For backend and express
const express = require('express');
const authenticate = require("./middleware/authenticate")
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { RefreshToken } = require('./model/models');
const logout = express();
const cors = require("cors");
console.log("App listen at port 5000");
const { jwtDecode } = require('jwt-decode');

logout.use(express.json());
logout.use(cors());
//set sign of cookie
logout.use(cookieParser())
const corsOptions = {
	origin: 'http://localhost:3000', // Change to frontend's URL
	credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
logout.use(cors(corsOptions));
logout.get("/", (req, resp) => {

	resp.send("App is Working");
	// Can check backend is working or not by
	// entering http://localhost:5000
	// If you see App is working means
	// backend working properly
});

//--------------------------------------------------------------------------------------------------//
// This route handler processes user logout requests for the '/logout' path.

// Route handler for creating a new token
logout.post('/logout',authenticate, async (req, resp) => {
	await RefreshToken.deleteOne({ email: req.body.email })
	await resp.clearCookie("refreshToken")
	// Send the request body back as a response.
	if (!await RefreshToken.findOne({ email: req.body.email })) {
		resp.status(200).json("Delete complete");
	} else {
		resp.status(400).json("Cannot delete user at database");
	}
})
//--------------------------------------------------------------------------------------------------//
mongoose.connect('mongodb://localhost:27017/', {
	dbName: 'little-lemon',
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to little-lemon database');
}).catch((err) => {
	console.log(err);
});
module.exports = logout;
