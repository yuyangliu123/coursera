// Code for mongoose config in backend
// Filename - backend/index.js

// To connect with your mongoDB database
// To connect with your mongoDB database
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


// Schema for users of app
const UserSchema = new mongoose.Schema({
	fname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
    password: {
		type: String,
		required: true,
		unique: true,
	},
    numberOfPeople: {
		type: String,
		required: true,
		unique: true,
	},
    resTime: {
		type: String,
		required: true,
		unique: true,
	},
    resDate: {
		type: Date,
		required: true,
		unique: true,
	},
    occasion: {
		type: String,
		required: true,
		unique: true,
	},
	Date: {
		type: Date,
		default: Date.now,
	},
});
const User = mongoose.model('users', UserSchema);
User.createIndexes();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
const { string } = require('yup');
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

	resp.send("App is Working");
	// You can check backend is working or not by 
	// entering http://loacalhost:5000
	
	// If you see App is working means
	// backend working properly
});

app.post("/register", async (req, resp) => {
	try {
		const user = new User(req.body);
		let result = await user.save();
		result = result.toObject();
		if (result) {
			delete result.password;
			resp.send(req.body);
			console.log(result);
		} else {
			console.log("User already register");
		}

	} catch (e) {
		resp.send(`Something Went Wrong,${e}`);
	}
});
app.listen(5000);
