// models.js
const mongoose = require('mongoose');

const ReserveSchema = new mongoose.Schema({
	fname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	numberOfPeople: {
		type: String,
		required: true,
	},
	resTime: {
		type: String,
		required: true,
	},
	resDate: {
		type: Date,
		required: true,
	},
	occasion: {
		type: String,
		required: true,
	},
	Date: {
		type: Date,
		default: Date.now,
	},
});

const RefreshSchema = new mongoose.Schema({
	refreshToken: {
		type: String,
		required: true,
	},
	accessToken: {
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
		expires: '1d', // token will be deleted after expired(1 day)
	},
});

const MealSchema = new mongoose.Schema({
	category: {
		type: String,
		require: true
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
		require: true
	},
	Date: {
		type: Date,
		default: Date.now,
	},
});

const ShoppingCartSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	totalAmount: {
		type: Number,
	},
	totalItem: {
		type: Number,
	},
	data: [{
		strMeal: {
			type: String,
		},
		numMeal: {
			type: Number,
		},
		idMeal: {
			type: String,
		},
		baseAmount: {
			type: Number,
		},
		cartAmount: {
			type: Number,
		},
		strMealThumb: {
			type: String,
		},
	}],
	likeItem: [{
		strMeal: {
			type: String,
		},
		idMeal: {
			type: String,
		},
		baseAmount: {
			type: Number,
		},
		cartAmount: {
			type: Number,
		},
		strMealThumb: {
			type: String,
		},
		numMeal: {
			type: Number,
		},
	}],
	Date: {
		type: Date,
		default: Date.now,
	},
});

const LikeItemSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	likeItem: [{
		strMeal: {
			type: String,
		},
		idMeal: {
			type: String,
		},
		baseAmount: {
			type: Number,
		},
		strMealThumb: {
			type: String,
		},
	}],
	Date: {
		type: Date,
		default: Date.now,
	},
});

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

const tokenLifeTime = "10m"
const ResetSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	token: {
		type: String,
		require: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: tokenLifeTime, // token will be deleted 10m later automatically
	},
});

const OrderCounterSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true
	},
	seq: {
		type: Number,
		default: 0
	}
});

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', ReserveSchema);
Reservation.createIndexes()
const RefreshToken = mongoose.models.RefreshToken || mongoose.model('RefreshToken', RefreshSchema);
const Meal = mongoose.models.Meal || mongoose.model('meal-data', MealSchema);
const ShoppingCart = mongoose.models.ShoppingCart || mongoose.model('shopping-cart1', ShoppingCartSchema);
const LikeItem = mongoose.models.LikeItem || mongoose.model('likeitem', LikeItemSchema);
const User = mongoose.models.User || mongoose.model('sign-up-data', UserSchema);
const Reset = mongoose.models.Reset || mongoose.model('reset-password', ResetSchema);
Meal.collection.createIndex({ category: 1 });
Meal.collection.createIndex({ price: 1 });

module.exports = { Reservation, RefreshToken, Meal, ShoppingCart, LikeItem, User, Reset};
