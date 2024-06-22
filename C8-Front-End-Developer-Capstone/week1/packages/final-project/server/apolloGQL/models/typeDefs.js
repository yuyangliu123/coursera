const gql = require('graphql-tag');

//Setting different query names for each independent query can prevent Query Merging or Query Interference.

const typeDefs = gql`
  type Query {
    shoppingcarts(email: String): [ShoppingCart]
    cartitemnumber(email: String): [ShoppingCart]
    likeitemnumber(email: String): [ShoppingCart]
    cartpageformat(email: String): [ShoppingCart]
    likeitemlist(email: String): [ShoppingCart]
  }
  type Mutation {
    updatelikelist(email: String, idMeal: String, baseAmount:Float, state: String): ShoppingCart
  }
  type ShoppingCart {
    email: String
    totalAmount: Float
    totalItem: Int
    data: [MealData]
    likeItem: [LikeItem]
  }
  type MealData {
    strMeal: String
    numMeal: Int
    idMeal: String
    baseAmount: Float
    cartAmount: Float
    strMealThumb: String
  }
  type LikeItem {
    strMeal: String
    idMeal: String
    baseAmount: Float
    cartAmount: Float
    strMealThumb: String
  }
`;

module.exports = { typeDefs };