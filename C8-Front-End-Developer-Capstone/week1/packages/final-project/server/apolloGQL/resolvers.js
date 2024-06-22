const ShoppingCart = require("./models/ShoppingCart");

const resolvers = {
  Query: {
    shoppingcarts: async (_, { email }) => await ShoppingCart.find({ email }),
    cartitemnumber: async (_, { email }) => await ShoppingCart.find({ email }),
    likeitemnumber: async (_, { email }) => await ShoppingCart.find({ email }),
    cartpageformat: async (_, { email }) => await ShoppingCart.find({ email }),
    likeitemlist: async (_, { email }) => await ShoppingCart.find({ email })
  },
  Mutation: {
    updatelikelist: async (_, { email, idMeal, baseAmount, state }) => {
      let shoppingcart = await ShoppingCart.findOne({ email });
      if (!shoppingcart) {
        throw new Error("Shopping cart not found");
      }

      if (state === "addtocart") {
        const item = shoppingcart.likeItem.find(item => item.idMeal === idMeal);
        console.log({"item":item,"a":item.baseAmount});
        const alreadyInCart=shoppingcart.data.find(item => item.idMeal === idMeal);
        const numMeal={numMeal:1}
        const cartAmount={cartAmount:item.baseAmount}
        const item1=Object.assign(item,numMeal,cartAmount)
        if (item1) {
          if(!alreadyInCart){
            shoppingcart.data.push(item1);
          }else if(alreadyInCart){
            alreadyInCart.numMeal+=1
          }
          shoppingcart.totalItem += 1;
          shoppingcart.totalAmount += baseAmount;
          shoppingcart.totalAmount=parseFloat(shoppingcart.totalAmount.toFixed(2))
          shoppingcart.likeItem = shoppingcart.likeItem.filter(item => item.idMeal !== idMeal);
        }
      } else if (state === "delete") {
        shoppingcart.likeItem = shoppingcart.likeItem.filter(item => item.idMeal !== idMeal);
      }

      await shoppingcart.save();
      return shoppingcart.likeItem;
    },
  },
};

module.exports = { resolvers };
