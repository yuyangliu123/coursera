const gql = require('graphql-tag');

//Setting different query names for each independent query can prevent Query Merging or Query Interference.

const typeDefs = gql`
scalar Date
type Query {
  shoppingcarts(email: String): [ShoppingCart]
  cartitemnumber(email: String): [ShoppingCart]
  likeitemnumber(email: String): [ShoppingCart]
  cartpageformat(email: String): [ShoppingCart]
  likeitemlist(email: String): [ShoppingCart]
  myorderinfo(email: String): [ShoppingCart]
  orderdetail(email: String, uuid: String): [ShoppingCart]
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
  order: [OrderData]
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
  orderNumber: String
  addressInfo: [AddressInfo]
  itemInfo: [ItemInfo]
  orderAmount: Float
  orderItem: Int
  shippingMethod:String
  shippingFee:Float
  discount:Boolean
  discountCode:String
  checkoutAmount:Float
  payment: String
  cardNumber: Int
  createdAt: Date
  orderUuid: String
}
type ItemInfo {
  strMeal: String
  numMeal: Int
  idMeal: String
  baseAmount: Float
  cartAmount: Float
  strMealThumb: String

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