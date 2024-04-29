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
	rememberMe:{
		type:Boolean,
		require:true
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
//--------------------------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------------------------//
// For backend and express
const express = require('express');
const login = express();
const cors = require("cors");
const bcrypt =require("bcrypt")
const jwt=require("jsonwebtoken")
const SECRET_KEY = 'aaaaaaaa';
const { string } = require('yup');
console.log("App listen at port 5000");
login.use(express.json());
login.use(cors());
login.get("/", (req, resp) => {

	resp.send("App is Working");
	// Can check backend is working or not by
	// entering http://localhost:5000
	// If you see App is working means
	// backend working properly
});
//--------------------------------------------------------------------------------------------------//

const createJwtToken = (fname,lname,email,expiresIn) => {
    const payload = {
		fname:fname,
		lname:lname,
        email: email
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
    return token;
}

//--------------------------------------------------------------------------------------------------//
// This route handler processes user login requests for the '/login' path.
login.post("/login", async (req, resp) => {
    try {
        // Find a user instance with the email from the request body.
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            // Check if the password matches.
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (validPassword) {
                if (req.body.rememberMe === true) {
                    // Create a JWT token with a longer expiration (30 days)
                    const token = createJwtToken(user.fname, user.lname, req.body.email, "30d");
                    return resp.status(200).send({ state: true, name: user.fname, message: "remember", token });
                } else {
                    // Create a JWT token with a shorter expiration (1 mins)
                    const token = createJwtToken(user.fname, user.lname, req.body.email, "1m");
                    return resp.status(200).send({ state: false, name: user.fname, message: "not remember", token });
                }
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
//--------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------//
// This route handler processes user login requests for the '/login' path.

	// Route handler for creating a new token
	login.post('/create-token', async (req, resp) => {
		try {
			// Validate user data (e.g., check if email exists)
			// ...
			// Assuming user data is valid, create a new token
			const token = createJwtToken(req.body.fname, req.body.lname, req.body.email, '1m');
			resp.status(200).json({ token });
		} catch (error) {
			resp.status(400).json({ error: 'Something went wrong' });
		}
	})
//--------------------------------------------------------------------------------------------------//

module.exports = login;
