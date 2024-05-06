
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
const login2 = express();
const cors = require("cors");
const bcrypt =require("bcrypt")
const jwt=require("jsonwebtoken")
const uuid=require("uuid")
const SECRET_KEY = 'aaaaaaaa';
const { string } = require('yup');
console.log("App listen at port 5000");
login2.use(express.json());
login2.use(cors());
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
                    // Create a JWT token with a longer expiration (30 days)
                    const accessToken = createJwtToken(user.fname, user.lname, req.body.email, "10s");
					const refreshToken = createJwtToken(user.fname, user.lname, req.body.email, "1d");
					const newToken = new RefreshToken({
						email: user.email,
						refreshToken:refreshToken
					  });
					  // Asynchronously save the new user to the database.
					  let result = await newToken.save();
					  // Convert the Mongoose document object to a plain JavaScript object.
					  result = result.toObject();
					  // Delete the password property from the result object before sending it back to the client.
					  delete result.password;
					  // Log the saved user object to the server's console.
					  console.log(result);

                    return (
						resp.status(200).send({ state: true, name: user.fname, accessToken, refreshToken})
					);
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
	try {
		// Validate user data (e.g., check if email exists)
		// ...
		// Assuming user data is valid, create a new token
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			const refreshtoken= await RefreshToken.findOne({email: req.body.email})
            let sameToken
			sameToken=await (refreshtoken.refreshToken===req.body.refreshToken)
			// delete old token in storage
			await RefreshToken.deleteOne({ refreshToken: req.body.refreshToken });
			if(sameToken===true){
				const accessToken = await createJwtToken(req.body.fname, req.body.lname, req.body.email, '10s');
        		const refreshToken = await createJwtToken(req.body.fname, req.body.lname, req.body.email, '1d');
				const newToken = new RefreshToken({
					email: req.body.email,
					refreshToken:refreshToken
				  });
				// Asynchronously save the new user to the database.
				let result = await newToken.save();
				// Convert the Mongoose document object to a plain JavaScript object.
				result = result.toObject();
				//response new access token & refresh token to front-end
				resp.status(200).json({ accessToken, refreshToken });
				return
			}else{
				//if someone want to use old refresh token to get new token, sameToken'll return false, and delete data in storage
				await RefreshToken.deleteOne({ refreshToken: refreshtoken.refreshToken });
				resp.status(400).send("Not same token");
				return
			}
        } else {
            // If the user does not exist, send an error message.
            resp.status(401).send("User does not exist");
			return
        }

	} catch (error) {
		resp.status(400).json({ error: 'Something went wrong' });
	}
});



module.exports = login2;
