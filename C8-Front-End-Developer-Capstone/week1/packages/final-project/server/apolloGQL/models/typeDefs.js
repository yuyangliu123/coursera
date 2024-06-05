const gql = require('graphql-tag');

const typeDefs = gql`
  type Query {
    hello(name: String): String
    shoppingcarts(email:String): [ShoppingCart]
  }

  type ShoppingCart {
    email: String
    totalAmount: Float
    totalItem:Int
    data:[MealData]
  }

  type MealData {
    strMeal: String
    numMeal: Int
    idMeal: String
    baseAmount: Float
    cartAmount: Float
    strMealThumb: String
  }
`;

module.exports = { typeDefs };
