const mongoose = require('mongoose');

const ShoppingCartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  totalItem: {
    type: Number,
    required: true,
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
    baseAmount: {
      type: Number,
      required: true,
    },
    cartAmount: {
      type: Number,
      required: true,
    },
    strMealThumb: {
      type: String,
      required: true,
    },
  }],
  Date: {
    type: Date,
    default: Date.now,
  },
});

const ShoppingCart = mongoose.model('shopping-cart', ShoppingCartSchema);

module.exports = ShoppingCart;
