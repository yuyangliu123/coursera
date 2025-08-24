const gql = require('graphql-tag');

//Setting different query names for each independent query can prevent Query Merging or Query Interference.

const typeDefs = gql`
scalar Date
type Query {
  shoppingcarts(email: String): [ShoppingCart]
  cartitemnumber(email: String): [ShoppingCart]
  likeitemnumber(email: String): [ShoppingCart]
  cartpageformat(email: String): [ShoppingCart]
  likeitemlist(email: String): [LikeItem]
  myorderinfo(email: String): [OrderData]
  orderdetail(email: String, uuid: String): [OrderData]
}
type Mutation {
  updatelikelist(email: String, idMeal: String, baseAmount: Float, state: String): ShoppingCart
}
type ShoppingCart {
  email: String
  totalAmount: Float
  totalItem: Int
  checkedAmount: Float
  checkedItem: Int
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
  checked: Boolean
}
type LikeItem {
  strMeal: String
  idMeal: String
  baseAmount: Float
  cartAmount: Float
  strMealThumb: String
}
type OrderData {
  email: String
  orderNumber: String
  shippingMethod: String
  shippingFee: Float
  discount: Boolean
  discountCode: String
  payment: String
  creditCardNumber: Int
  createdAt: Date
  orderUuid: String
  orderAmount: Float
  orderItem: Int
  addressInfo: [AddressInfo]
  itemInfo: [ItemInfo]
}
type ItemInfo {
  numMeal: Int
  idMeal: String
  baseAmount: Float
  strMeal: String
  strMealThumb: String
  cartAmount: Float
}
type AddressInfo  {
  addressFname: String
  addressLname: String
  phone: Int
  address1: String
  address2: String
  city: String
  country: String
  uuid: String,
},
`


  ;

module.exports = { typeDefs };