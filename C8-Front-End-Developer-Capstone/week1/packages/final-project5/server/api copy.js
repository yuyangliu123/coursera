const mongoose = require('mongoose');

//--------------------------------------------------------------------------------------------------//
// For backend and express
const express = require('express');
const cookieParser = require('cookie-parser');

const https = require("https")
const fs = require("fs")
const api = express();
const cors = require("cors");
const { User, RefreshToken, Meal, ShoppingCart, LikeItem } = require('./model/models');
const { jwtDecode } = require('jwt-decode');

const { string } = require('yup');
const authenticate = require('./middleware/authenticate');
console.log("App listen at port 5000");
//set sign of cookie

api.use(express.json());
api.use(cookieParser())
const corsOptions = {
	origin: 'http://localhost:3000', // Change to frontend's URL
	credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
api.use(cors(corsOptions));
api.get("/", (req, resp) => {

	resp.send("App is Working");
	// Can check backend is working or not by
	// entering http://localhost:5000
	// If you see App is working means
	// backend working properly
});
//--------------------------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------------------------//

api.get("/api", async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const skip = (page - 1) * limit;

		let category = await Meal.distinct("category");
		let categoriesData = await Meal.find().skip(skip).limit(limit);

		res.status(201).json({ "category": category, "data": categoriesData });
	} catch (err) {
		console.log("Error: " + err.message);
	}
});

//--------------------------------------------------------------------------------------------------//


// api.get("/api/order", async (req, res) => {
// 	try {
// 	  const page = parseInt(req.query.page) || 1;
// 	  const limit = parseInt(req.query.limit) || 10;
// 	  const skip = (page - 1) * limit;
// 	  const category = req.query.category;

// 	  let data = await Meal.find({ category }).skip(skip).limit(limit);

// 	  res.status(201).json({ "data": data });
// 	} catch (err) {
// 	  console.log("Error: " + err.message);
// 	}
//   });

api.get('/order', async (req, res) => {
	try {
		let category = await Meal.distinct("category")
		let categoriesData = await Meal.find({ category: req.query.category })
		res.status(201).json({ "category": category, "data": categoriesData });
	} catch (err) {
		console.log("Error: " + err.message);
	}
});


// api.post("/sortByCate", async (req, res) => {
// 	try {
// 		let categoriesData = await Meal.find({ category: req.body.selectedCategory }).limit(20)
// 		res.status(201).json({ "data": categoriesData });
// 	} catch (err) {
// 		console.log("Error: " + err.message);
// 	}
// });

api.get("/foodPage/:strMeal", async (req, res) => {
	try {
		let mealData = await Meal.find({ strMeal: req.params.strMeal })
		res.status(200).json(mealData[0])
	} catch (err) {
		console.log("Error: " + err.message);
	}
})

api.post("/addToCart", authenticate, async (req, res) => {
	const accessToken = req.headers['authorization'].split(' ')[1];
	const email = jwtDecode(accessToken)?.email
	// Check if there is cart data in the database
	let shoppingcart = await ShoppingCart.findOne({ email: email });
	let mealItem = await Meal.findOne({ idMeal: req.body.idMeal });
	if (!mealItem) {
		return res.status(400).send({ error: "Meal item not found" });
	}

	let price = mealItem.price;
	if (typeof price !== 'number' || isNaN(price)) {
		return res.status(400).send({ error: "Invalid meal price" });
	}

	if (shoppingcart) {
		// If the user already has a shopping cart, find the meal
		let cartItem = shoppingcart.data.find(item => item.idMeal === req.body.idMeal);
		if (cartItem) {
			// If the meal already exists in the shopping cart, update numMeal and cartAmount
			cartItem.numMeal += req.body.numMeal;
			cartItem.cartAmount = cartItem.numMeal * cartItem.baseAmount;
		} else {
			// If the meal doesn't exist in the shopping cart, add it to database
			shoppingcart.data.push({
				strMeal: req.body.meal,
				numMeal: req.body.numMeal,
				idMeal: req.body.idMeal,
				baseAmount: price,
				cartAmount: req.body.numMeal * price,
				strMealThumb: req.body.strMealThumb,
			});
		}
	} else {
		// If the user doesn't have a shopping cart, create a new one
		shoppingcart = new ShoppingCart({
			email: email,
			totalAmount: req.body.numMeal * price,
			totalItem: req.body.numMeal,
			data: [{
				strMeal: req.body.meal,
				numMeal: req.body.numMeal,
				idMeal: req.body.idMeal,
				baseAmount: price,
				cartAmount: req.body.numMeal * price,
				strMealThumb: req.body.strMealThumb,
			}]
		});
	}

	// Calculate totalAmount
	shoppingcart.totalAmount = shoppingcart.data.reduce((sum, item) => sum + item.cartAmount, 0);
	shoppingcart.totalAmount = parseFloat(shoppingcart.totalAmount.toFixed(2));
	// Calculate totalItem
	shoppingcart.totalItem = shoppingcart.data.reduce((sum, item) => sum + item.numMeal, 0);
	// Asynchronously save the shopping cart to the database.
	let result = await shoppingcart.save();
	// Convert the Mongoose document object to a plain JavaScript object.
	result = result.toObject();
	// Send the request body back as a response.
	res.status(200).send(result);
	// Log the saved user object to the server's console.
	console.log(result);
});






api.post("/update", authenticate, async (req, res) => {
	const accessToken = req.headers['authorization'].split(' ')[1];
	const email = jwtDecode(accessToken)?.email
	// Check if there is cart data in the database
	let shoppingcart = await ShoppingCart.findOne({ email: email });
	console.log('Request body:', req.body); // Add this line to log the request body

	if (req.body.event === "update") {
		if (shoppingcart) {
			// If the user has a shopping cart, find the meal
			let cartItem = shoppingcart.data.find(item => item.idMeal === req.body.updatedItems.idMeal)
			if (cartItem) {
				// If the number of meals in the request is <= 0 (through the close button or modifying the input number)
				if (req.body.updatedItems.numMeal <= 0) {
					// Filter out the item with numMeal > 0
					shoppingcart.data = shoppingcart.data.filter(item => item.idMeal !== req.body.updatedItems.idMeal);
				} else {
					// If the meal already exists in the shopping cart, update numMeal and cartAmount
					cartItem.numMeal = req.body.updatedItems.numMeal;
					cartItem.cartAmount = cartItem.numMeal * cartItem.baseAmount;
				}
			}
			if ((shoppingcart.data.length === 0) && (shoppingcart.likeItem.length === 0)) {
				// If shoppingcart.data is empty, delete the shopping cart
				await ShoppingCart.deleteOne({ email: email });
				res.status(201).send({ status: "delete" });
			} else {
				// If shoppingcart.data is not empty, update cart and respond
				// Calculate totalAmount
				shoppingcart.totalAmount = shoppingcart.data.reduce((sum, item) => sum + item.cartAmount, 0);
				shoppingcart.totalAmount = parseFloat(shoppingcart.totalAmount.toFixed(2));
				// Calculate totalItem
				shoppingcart.totalItem = shoppingcart.data.reduce((sum, item) => sum + item.numMeal, 0);
				// Asynchronously save the shopping cart to the database.
				let result = await shoppingcart.save();
				// Convert the Mongoose document object to a plain JavaScript object.
				result = result.toObject();
				// Send the request body back as a response.
				res.status(201).send({ result, status: "update" });
			}
		}
	} else if (req.body.event === "like") {
		if (shoppingcart) {
			if (req.body.likeState === "like") {
				shoppingcart.likeItem.push({
					idMeal: req.body.idMeal,
					strMeal: req.body.meal,
					baseAmount: req.body.price,
					strMealThumb: req.body.strMealThumb,
				});
			} else if (req.body.likeState === "none") {
				shoppingcart.likeItem = shoppingcart.likeItem.filter(item => item.idMeal !== req.body.idMeal);
				if ((shoppingcart.data.length === 0) && (shoppingcart.likeItem.length === 0)) {
					// If shoppingcart.data is empty, delete the shopping cart
					await ShoppingCart.deleteOne({ email: email });
					res.status(201).send({ status: "delete" });
					return
				}
			}
		} else {
			// If the user doesn't have a shopping cart, create a new one
			shoppingcart = new ShoppingCart({
				email: email,
				totalAmount: 0,
				totalItem: 0,
				likeItem: [{
					idMeal: req.body.idMeal,
					strMeal: req.body.meal,
					baseAmount: req.body.price,
					strMealThumb: req.body.strMealThumb,
				}]
			});
		}
		// Save the changes to the database
		let savedCart = await shoppingcart.save();
		res.status(200).send({ status: "ok", shoppingcart: savedCart });
	}
}
);


api.post("/like", async (req, res) => {
	try {
		// Check if the user already has a shopping cart
		let like = await LikeItem.findOne({ email: req.body.email });
		let mealItem = await Meal.findOne({ idMeal: req.body.idMeal });
		if (!mealItem) {
			return res.status(400).send({ error: "Meal item not found" });
		}

		let price = mealItem.price;
		if (typeof price !== 'number' || isNaN(price)) {
			return res.status(400).send({ error: "Invalid meal price" });
		}

		if (!like) {
			like = new LikeItem({
				email: req.body.email,
				likeItem: [{
					strMeal: req.body.meal,
					idMeal: req.body.idMeal,
					baseAmount: price,
					strMealThumb: req.body.strMealThumb,
				}]
			});
		}

		// Asynchronously save the shopping cart to the database.
		let result = await like.save();
		// Convert the Mongoose document object to a plain JavaScript object.
		result = result.toObject();
		// Send the request body back as a response.
		res.status(201).send(result);
		// Log the saved user object to the server's console.
		console.log(result);

	} catch (err) {
		console.log("Error: " + err.message);
		res.status(500).send({ error: err.message });
	}
});

module.exports = api;

