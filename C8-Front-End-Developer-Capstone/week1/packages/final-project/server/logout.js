//--------------------------------------------------------------------------------------------------//
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
//--------------------------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------------------------//
// Schema for users of app
// const BlacklistSchema = new mongoose.Schema({
//     jti: {
//       type: String,
//       required: true,
//     },
//     exp: {
//       type: Number,
//       required: true,
//     },
//   });
// let Blacklist;
// try {
//   Blacklist = mongoose.model(' blacklist');
// } catch (error) {
//     Blacklist = mongoose.model(' blacklist', BlacklistSchema);
// }

// Blacklist.createIndexes();


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
//--------------------------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------------------------//
// For backend and express
const express = require('express');
const cookieParser = require('cookie-parser');
const logout = express();
const cors = require("cors");
console.log("App listen at port 5000");
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
	logout.post('/logout', async (req, resp) => {
		try {
			const user = await RefreshToken.findOne({ email: req.body.email });
			if (user) {
				await RefreshToken.deleteOne({email:req.body.email})
				await resp.clearCookie("refreshToken")
				// Send the request body back as a response.
				if(!await RefreshToken.findOne({ email: req.body.email })){
					resp.status(200).json("Delete complete");
				}else{
					resp.status(400).json("Cannot delete user at database");
				}
			}else if(!user){
				resp.status(401).json("user doesn't exist")
			}
		} catch (e) {
			resp.status(500).send(`Something Went Wrong,${e}`);
		}
	})
//--------------------------------------------------------------------------------------------------//

module.exports = logout;
