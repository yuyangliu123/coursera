const mongoose = require('mongoose');

const ShoppingCartSchema =  new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	totalAmount: {
		type:Number,
	},
	totalItem: {
		type:Number,
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
		baseAmount:{
			type:Number,
		},
		cartAmount:{
			type:Number,
		},
		strMealThumb:{
			type:String,
		},
	}],
	likeItem: [{
		strMeal: {
			type: String,
		},
		idMeal: {
			type: String,
		},
		baseAmount:{
			type:Number,
		},
		cartAmount:{
			type:Number,
		},
		strMealThumb:{
			type:String,
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

const ShoppingCart = mongoose.model('shopping-cart1', ShoppingCartSchema);

module.exports = ShoppingCart;
