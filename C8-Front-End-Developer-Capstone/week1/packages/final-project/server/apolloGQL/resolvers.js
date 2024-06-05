const ShoppingCart = require("./models/ShoppingCart");

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name}`,
    shoppingcarts: async (_,{email}) => await ShoppingCart.find({email:email})
  }
};

module.exports = { resolvers };
