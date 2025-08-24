const { ShoppingCart } = require("../model/models");
const { getShoppingCart } = require("./getShoppingCart");

const updateCartCheckedState = async (email, updatedItems) => {
    // 1. 直接更新购物车中的 checked 状态
    const updatePromises = updatedItems.map(({ idMeal,newCheckedState }) =>
        ShoppingCart.findOneAndUpdate(
            { email, "data.idMeal": idMeal },
            { $set: { "data.$.checked": newCheckedState } }
        )
    )
    await Promise.all(updatePromises)

    // 2. 使用聚合管道获取更新后的完整结果
    const result = getShoppingCart(email)

    return result || {
        totalAmount: 0,
        totalItem: 0,
        checkedAmount: 0,
        checkedItem: 0,
        data: []
    };
}

module.exports = { updateCartCheckedState }