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
const MealSchema = new mongoose.Schema({
	category:{
		type:String,
		require:true
	},
	strMeal: {
		type: String,
		required: true,
	},
    strMealThumb: {
		type: String,
		required: true,
	},
	idMeal: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	Date: {
		type: Date,
		default: Date.now,
	},
});
let Meal;
try {
   Meal = mongoose.model('meal-data');
} catch (error) {
   Meal = mongoose.model('meal-data', MealSchema);
}

//--------------------------------------------------------------------------------------------------//
// Schema for users of app
const ShoppingCartSchema =  new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	totalAmount: {
		type:Number,
		require: true
	},
	totalItem: {
		type:Number,
		require: true
	},
	data: [{
		strMeal: {
			type: String,
			required: true,
		},
		numMeal: {
			type: Number,
			required: true,
		},
		idMeal: {
			type: String,
			required: true,
		},
		baseAmount:{
			type:Number,
			require: true,
		},
		cartAmount:{
			type:Number,
			require: true,
		},
		strMealThumb:{
			type:String,
			require:true,
		},
	}],
	Date: {
		type: Date,
		default: Date.now,
	},
});
let ShoppingCart;
try {
	ShoppingCart = mongoose.model('shopping-cart');
} catch (error) {
	ShoppingCart = mongoose.model('shopping-cart', ShoppingCartSchema);
}

//--------------------------------------------------------------------------------------------------//
// For backend and express
const express = require('express');
const https=require("https")
const fs=require("fs")
const api = express();
const cors = require("cors");
const { string } = require('yup');
console.log("App listen at port 5000");
api.use(express.json());
api.use(cors());
api.get("/", (req, resp) => {

	resp.send("App is Working");
	// Can check backend is working or not by
	// entering http://localhost:5000
	// If you see App is working means
	// backend working properly
});
//--------------------------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------------------------//
// This route handler processes user registration requests for the '/register' path.
  api.get("/api", async (req, res) => {
	  try {
		let category=await Meal.distinct("category")
		let categoriesData =await Meal.find().limit(20)

		res.status(201).json({"category":category,"data":categoriesData});
	  } catch (err) {
		console.log("Error: " + err.message);
	  }
  });
//--------------------------------------------------------------------------------------------------//


api.get('/order', async (req, res) => {
	try{
		let categoriesData =await Meal.find({category:req.query.category}).limit(20)
		res.status(201).json({"data":categoriesData});
	} catch (err) {
		console.log("Error: " + err.message);
	  }
  });

  api.post("/sortByCate", async (req, res) => {
	try {
		let categoriesData =await Meal.find({category:req.body.selectedCategory}).limit(20)
		res.status(201).json({"data":categoriesData});
	  } catch (err) {
		console.log("Error: " + err.message);
	  }
});

	api.get("/foodPage/:strMeal", async(req, res) => {
		try {
			let mealData = await Meal.find({strMeal: req.params.strMeal})
			res.status(200).json(mealData[0])
		} catch(err) {
			console.log("Error: " + err.message);
		}
	})

	api.post("/addToCart", async (req, res) => {
		try {
			if (req.body.isUser) {
				// Check if the user already has a shopping cart
				let shoppingcart = await ShoppingCart.findOne({ email: req.body.email });
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
						// If the meal doesn't exist in the shopping cart, add it
						shoppingcart.data.push({
							strMeal: req.body.meal,
							numMeal: req.body.numMeal,
							idMeal: req.body.idMeal,
							baseAmount: price,
							cartAmount: req.body.numMeal * price,
							strMealThumb:req.body.strMealThumb,
						});
					}
				} else {
					// If the user doesn't have a shopping cart, create a new one
					shoppingcart = new ShoppingCart({
						email: req.body.email,
						totalAmount: req.body.numMeal * price,
						totalItem: req.body.numMeal,
						data: [{
							strMeal: req.body.meal,
							numMeal: req.body.numMeal,
							idMeal: req.body.idMeal,
							baseAmount: price,
							cartAmount: req.body.numMeal * price,
							strMealThumb:req.body.strMealThumb,
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
				res.status(201).send(result);
				// Log the saved user object to the server's console.
				console.log(result);
			}
		} catch (err) {
			console.log("Error: " + err.message);
			res.status(500).send({ error: err.message });
		}
	});
	
	
	
	

	api.post("/carts", async (req, res) => {
		try {
				// Check if the user already has a shopping cart
				let shoppingcart = await ShoppingCart.findOne({email: req.body.email});
				res.status(201).json({shoppingcart});
				console.log(shoppingcart);
		} catch (err) {
			console.log("Error: " + err.message);
		}
	});

	api.post("/update", async (req, res) => {
		try {
			let shoppingcart = await ShoppingCart.findOne({ email: req.body.email });
	
			if (shoppingcart) {
				// If the user already has a shopping cart, find the meal
				let cartItem = shoppingcart.data.find(item => item.idMeal === req.body.updatedItems.idMeal);
				if (cartItem) {
					if(req.body.updatedItems.numMeal<=0){
						// Filter out the item with numMeal<=0
						shoppingcart.data = shoppingcart.data.filter(item => item.idMeal !== req.body.updatedItems.idMeal);
					} else {
						// If the meal already exists in the shopping cart, update numMeal and cartAmount
						cartItem.numMeal = req.body.updatedItems.numMeal;
						cartItem.cartAmount = cartItem.numMeal * cartItem.baseAmount;
					}
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
				res.status(201).send(result);
			}
		}catch(err){
			console.log(err);
		}
	});
	
module.exports = api;

