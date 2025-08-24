const { ShoppingCart } = require("../model/models");
const { getShoppingCart } = require("./getShoppingCart");

const updateCartItem = async (email, updatedItems) => {
    const session = await ShoppingCart.startSession();
    session.startTransaction();
    try {
        // 1. 只查询需要更新的商品（通过 $filter 减少返回数据量）
        const cart = await ShoppingCart.aggregate([
            { $match: { email } },
            {
                $project: {
                    totalItem: 1,
                    data: {
                        $filter: {
                            input: "$data",
                            as: "item",
                            cond: { $in: ["$$item.idMeal", updatedItems.map(u => u.idMeal)] }
                        }
                    }
                }
            }
        ]).session(session);

        if (!cart || cart.length === 0) throw new Error('cart not exist');
        const cartData = cart[0];

        // 2. calc totalDifference
        let totalDifference = 0;
        const updates = updatedItems.map(item => {
            const oldItem = cartData.data.find(i => i.idMeal === item.idMeal);
            if (!oldItem) throw new Error(`meal ${item.idMeal} not in cart`);

            const difference = item.value - oldItem.numMeal;
            totalDifference += difference;
            return { idMeal: item.idMeal, value: item.value };
        });

        // 3. update numMeal（use bulkWrite)
        const bulkOps = updatedItems.map(item => ({
            updateOne: {
                filter: { email, "data.idMeal": item.idMeal },
                update: { $set: { "data.$.numMeal": item.value } }
            }
        }));
        await ShoppingCart.bulkWrite(bulkOps, { session });

        // 4. update totalItem
        await ShoppingCart.updateOne(
            { email },
            { $inc: { totalItem: totalDifference } },
            { session }
        );

        await session.commitTransaction();
        const result = await getShoppingCart(email)

        return result || {
            totalAmount: 0,
            totalItem: 0,
            checkedAmount: 0,
            checkedItem: 0,
            data: []
        }
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

module.exports = { updateCartItem };