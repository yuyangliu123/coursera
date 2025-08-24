const { ShoppingCart, Order, Meal } = require("../model/models");

const getCompletedShoppingCart=async({email})=>{
    // 查找购物车
        const shoppingCart = await ShoppingCart.findOne({ email });
        if (!shoppingCart) {
          return {
            totalAmount: 0,
            totalItem: 0,
            data: []
          };
        }

        // 获取购物车中的商品ID
        const itemIds = shoppingCart.data?.map(item => item.idMeal) || [];
        if (itemIds.length === 0) {
          return {
            totalAmount: 0,
            totalItem: 0,
            data: []
          };
        }

        // 获取完整的商品信息
        const meals = await Meal.find({ idMeal: { $in: itemIds } });

        // 创建商品ID到商品详情的映射
        const mealMap = meals.reduce((map, meal) => {
          map[meal.idMeal] = meal;
          return map;
        }, {});

        // 合并购物车数据和商品详情
        const mergedData = shoppingCart.data.map(cartItem => {
          const mealInfo = mealMap[cartItem.idMeal] || {};

          return {
            ...cartItem.toObject(), // 保留购物车中的所有原始字段
            strMeal: mealInfo.strMeal || cartItem.strMeal,
            baseAmount: mealInfo.price || cartItem.baseAmount,
            strMealThumb: mealInfo.strMealThumb || cartItem.strMealThumb,
            // 确保numMeal是数字
            numMeal: Number(cartItem.numMeal) || 1,
            // 计算当前商品总价
            cartAmount: (Number(cartItem.numMeal) || 1) *
              (Number(mealInfo.price) || Number(cartItem.baseAmount) || 0)
          };
        });

        // 计算总计
        const totalAmount = Number(
          mergedData.reduce((sum, item) => sum + (item.cartAmount || 0), 0)
            .toFixed(2)
        );

        const totalItem = mergedData.reduce(
          (sum, item) => sum + (Number(item.numMeal) || 0), 0
        );
        const checkedAmount=Number(
          mergedData.filter(item=>item.checked===true).reduce((sum, item) => sum + (item.cartAmount || 0), 0)
            .toFixed(2)
        );
        const checkedItem=mergedData.filter(item=>item.checked===true).reduce(
          (sum, item) => sum + (Number(item.numMeal) || 0), 0
        );
        // 返回合并后的结果
        const result = {
          email: shoppingCart.email,
          totalAmount,
          totalItem,
          checkedAmount,
          checkedItem,
          data: mergedData,
          __typename: "ShoppingCart"
        }
        return result
}
module.exports = { getCompletedShoppingCart };