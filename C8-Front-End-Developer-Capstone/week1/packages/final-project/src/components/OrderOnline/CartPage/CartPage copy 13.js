import { gql, useQuery } from '@apollo/client';
import { Box, Button, Checkbox, HStack, Image, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast, VStack } from '@chakra-ui/react';
import { useToken, useUserRotate } from '../../provider/JwtTokenRotate';
import { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { MealContext } from '../../provider/MealContext';
import { SmallCloseIcon } from "@chakra-ui/icons";
import CartPageHeading from './CartPageHeading';
import { Link, useNavigate } from 'react-router-dom';
import { openDB } from 'idb';
import { axiosInstance, axiosInstanceWithTokenCheck } from '../../provider/axiosInstanceWithTokenCheck';
import Cookies from 'js-cookie';
import { debounceRAF } from '../../provider/debounceRAF';
import LazyLoadImage from '../../provider/LazyLoadImage';
import cartPageConfig from './config/cartPageConfig';
import { usePendingItems } from '../../provider/usePendingItems';
import { toast } from 'react-toastify'; //import toast
import { Modal, ModalButton, ModalContent } from '../../provider/ModalsSystem';
import LoginRotate from '../../Register/LoginRotate';
const CARTPAGE_QUERY = gql`
    query CartPageformat($email: String) {
    cartpageformat(email: $email) {
        totalAmount
        totalItem
        checkedAmount
        checkedItem
        data {
        strMeal
        numMeal
        idMeal
        baseAmount
        strMealThumb
        checked
        }
    }
    }
`;

// init IndexedDB
const initDB = async () => {
    const db = await openDB('meal-database', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('cart')) {
                db.createObjectStore('cart', { keyPath: 'idMeal' });
            }
        },
    });
    return db;
};

const updateDB = async (newData) => {
    const db = await initDB();
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');
    await store.put(newData);
    await tx.done;
};

const CartPage = ({ initialData, initialInputValue, loading, error, fetchlike, imageWidth }) => {
    const { identifier, isEmail } = useUserRotate();
    const { cartItem, setCartItem } = useContext(MealContext);
    const [userInfo, setUserInfo] = useState({ mergeCart: false, sessionId: !isEmail ? identifier : null, accessToken: null })
    const [cartData, setCartData] = useState(initialData);
    const [inputValues, setInputValues] = useState(initialInputValue);
    const { updateToken } = useToken();

    const navigate = useNavigate();
    // const [updatedItems, setUpdatedItems] = useState({});
    //If a boolean is used, useEffect will not be triggered when isUpdate is false
    // const [isUpdate, setIsUpdate] = useState(0)
    useEffect(() => {
        console.log(userInfo, "userInfo");

    }, [userInfo])
    const { addPendingItems, finishPending } = usePendingItems({
        sendToServer:
            async (latestPendingItems) => {
                console.log("finishPending occur");

                try {
                    const endpoint = userInfo.mergeCart
                        ? "http://localhost:5000/shoppingcart/mergeCart"
                        : "http://localhost:5000/shoppingcart/updateCart";

                    const payload = userInfo.mergeCart
                        ? { updatedItems: latestPendingItems, userInfo: userInfo }
                        : { updatedItems: latestPendingItems };
                    const result = await (await axiosInstanceWithTokenCheck()).post(endpoint, payload)
                    if (result.status === 200) {
                        // setCartData(prevCartData => ({
                        //     ...prevCartData,
                        //     totalAmount: result.data.result.totalAmount,
                        //         totalItem: result.data.result.totalItem,
                        //     checkedAmount: result.data.result.checkedAmount,
                        //     checkedItem: result.data.result.checkedItem,
                        // }));
                        setCartData(prevCartData => {
                            if (!prevCartData) return prevCartData;
                            return {
                                ...prevCartData,
                                data: prevCartData.data.map(dataItem => {
                                    // 找到对应的更新项
                                    const updatedItem = result.data.result.data.find(item => item.idMeal === dataItem.idMeal);
                                    return updatedItem ? {
                                        ...dataItem,
                                        numMeal: updatedItem.numMeal,
                                        cartAmount: updatedItem.cartAmount, // 更新 cartAmount
                                        checked: updatedItem.checked || false
                                    } : dataItem;
                                }),
                                totalAmount: result.data.result.totalAmount,
                                totalItem: result.data.result.totalItem,
                                checkedAmount: result.data.result.checkedAmount,
                                checkedItem: result.data.result.checkedItem
                            };
                        });
                    }
                } catch (error) {
                    if (error.code === "ECONNABORTED") {
                        // toast({ title: "請求超時：後端處理時間過長", status: "error" });
                    } else if (error.response) {
                        // 正常後端錯誤（如 400、500）
                    } else {
                        // toast({ title: "網路錯誤", status: "error" });
                    }
                }
            },

        onClear: () => console.log("pendingItems cleared"),
        debounceTime: 2000
    });
    console.log(initialInputValue, "initialInputValue", inputValues, initialInputValue == inputValues);




    //modify current input
    const handleInputChange = (meal, value) => {
        setInputValues(prev => ({ ...prev, [meal.strMeal]: value }));
    };

    // // 创建发送请求到后端的函数
    // const sendUpdateToServer = async (meal, value) => {
    //     // 准备要发送的数据
    //     const updatedMeal = {
    //         idMeal: meal.idMeal,
    //         numMeal: Number(value),
    //         baseAmount: meal.baseAmount
    //     };

    //     try {
    //         if (isEmail) {
    //             // 已登录用户：发送请求到后端
    //             let result = await (await axiosInstanceWithTokenCheck()).post(
    //                 "http://localhost:5000/api/update",
    //                 { event: "update", updatedItems: updatedMeal }
    //             );

    //             // 处理服务器响应
    //             if (result) {
    //                 if (result.data.status === "update") {
    //                     // 同步服务器返回的结果
    //                     setCartData(result.data.result);
    //                     setCartItem(result.data.result.totalItem);
    //                 } else if (result.data.status === "delete") {
    //                     setCartItem(0);
    //                     setCartData("");
    //                 }
    //             }
    //         } else {
    //             // 未登录用户：更新本地数据库
    //             const db = await initDB();
    //             let existingCart = await db.get('cart', 'cartData');

    //             if (existingCart) {
    //                 if (Number(value) <= 0) {
    //                     // 如果数量为0，从购物车中移除该商品
    //                     existingCart.data = existingCart.data.filter(item => item.idMeal !== meal.idMeal);
    //                 } else {
    //                     // 否则更新该商品的数量
    //                     const targetItem = existingCart.data.find(item => item.idMeal === meal.idMeal);
    //                     if (targetItem) {
    //                         targetItem.numMeal = Number(value);
    //                         targetItem.cartAmount = targetItem.numMeal * targetItem.baseAmount;
    //                     }
    //                 }

    //                 // 重新计算总金额和总商品数量
    //                 existingCart.totalAmount = existingCart.data.reduce(
    //                     (sum, item) => sum + item.cartAmount,
    //                     0
    //                 );
    //                 existingCart.totalAmount = Number(existingCart.totalAmount.toFixed(2));
    //                 existingCart.totalItem = existingCart.data.reduce(
    //                     (sum, item) => sum + item.numMeal,
    //                     0
    //                 );

    //                 // 更新本地状态
    //                 setCartData(existingCart);
    //                 setCartItem(existingCart.totalItem);

    //                 // 更新IndexedDB
    //                 await updateDB(Object.assign(existingCart, { idMeal: 'cartData' }));
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };
    // // 使用 debounceRAF 创建防抖版本的服务器更新函数
    // // 使用 useCallback 确保函数引用稳定，避免重复创建
    // const debouncedSendCartItemToServer = useCallback(
    //     debounceRAF(async (updatedItem) => {
    //         try {
    //             const result = await (await axiosInstanceWithTokenCheck()).post(
    //                 "http://localhost:5000/shoppingcart/updateCartItem",
    //                 { updatedItems: updatedItem }
    //             );
    //             if (result.status === 200) {
    //                 setCartData(prevCartData => {
    //                     if (!prevCartData) return prevCartData;
    //                     return {
    //                         ...prevCartData,
    //                         data: prevCartData.data.map(dataItem => {
    //                             // 找到对应的更新项
    //                             const updatedItem = result.data.result.data.find(item => item.idMeal === dataItem.idMeal);
    //                             return updatedItem ? {
    //                                 ...dataItem,
    //                                 numMeal: updatedItem.numMeal,
    //                                 cartAmount: updatedItem.cartAmount, // 更新 cartAmount
    //                                 checked: updatedItem.checked || false
    //                             } : dataItem;
    //                         }),
    //                         totalAmount: result.data.result.totalAmount,
    //                         totalItem: result.data.result.totalItem,
    //                         checkedAmount: result.data.result.checkedAmount,
    //                         checkedItem: result.data.result.checkedItem
    //                     };
    //                 });
    //                 // setCartData(prevCartData => ({
    //                 //     ...prevCartData,
    //                 //     checkedAmount: result.data.result.checkedAmount,
    //                 //     checkedItem: result.data.result.checkedItem,
    //                 //     // cartAmount:result.data.result.cartAmount,  here
    //                 // }));
    //                 console.log(result, "result", cartData, "cartdata");
    //             }
    //         } catch (error) {
    //             console.error("Failed to update check state in Redis", error);
    //         }
    //     }, 500)
    //     , [])


    // const handleChangeValue = async (items, value) => {
    //     try {
    //         const itemsArray = Array.isArray(items) ? items : [items];
    //         const itemsToUpdate = itemsArray.map(item => ({
    //             idMeal: item.idMeal,
    //             value: Number(value)
    //         }))
    //         console.log(itemsToUpdate, "itemsToUpdate", cartData, "cartData");
    //         setCartData(prevCartData => {
    //             if (!prevCartData) return prevCartData;
    //             return {
    //                 ...prevCartData,
    //                 data: prevCartData.data.map(dataItem => {
    //                     const shouldUpdate = itemsToUpdate.some(item => item.idMeal === dataItem.idMeal);
    //                     return shouldUpdate ? { ...dataItem, numMeal: value } : dataItem;
    //                 }),
    //             };
    //         });
    //         if (isEmail) {
    //             debouncedSendCartItemToServer(itemsToUpdate);
    //         } else {
    //             console.log("not user");

    //         }
    //     } catch (e) {

    //     }
    // }


    // const handleCheckState = async (items, isChecked) => {
    //     try {

    //         const itemsArray = Array.isArray(items) ? items : [items];
    //         const itemsToUpdate = itemsArray.map(item => ({
    //             idMeal: item.idMeal,
    //             oldCheckedState: item.checked,
    //             newCheckedState: isChecked,
    //         }));


    //         setCartData(prevCartData => {
    //             if (!prevCartData) return prevCartData;
    //             return {
    //                 ...prevCartData,
    //                 data: prevCartData.data.map(dataItem => {
    //                     const shouldUpdate = itemsToUpdate.some(item => item.idMeal === dataItem.idMeal);
    //                     return shouldUpdate ? { ...dataItem, checked: isChecked } : dataItem;
    //                 }),
    //             };
    //         });

    //         if (isEmail) {
    //             addPendingItems(itemsToUpdate)
    //         } else {
    //             // 未登录用户：仍然使用IndexedDB
    //             const db = await initDB();
    //             let existingCart = await db.get('cart', 'cartData');

    //             if (existingCart) {
    //                 // 更新check状态
    //                 for (const itemToUpdate of items) {
    //                     const cartItem = existingCart.data.find(item => item.idMeal === itemToUpdate.idMeal);
    //                     if (cartItem) {
    //                         cartItem.checked = itemToUpdate.checked;
    //                     }
    //                 }

    //                 // 重新计算checked项目的统计数据
    //                 const checkedItems = existingCart.data.filter(item => item.checked === true);
    //                 existingCart.checkedItem = checkedItems.reduce((sum, item) => sum + item.numMeal, 0);
    //                 existingCart.checkedAmount = Number(checkedItems.reduce(
    //                     (sum, item) => sum + item.cartAmount, 0
    //                 ).toFixed(2));

    //                 // 更新本地状态
    //                 setCartData(existingCart);

    //                 // 更新IndexedDB
    //                 await updateDB(Object.assign(existingCart, { idMeal: 'cartData' }));
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error updating check state:", error);
    //     }
    // };


    // const debouncedSendCheckStateToServer = useCallback(
    //     debounceRAF(async () => {
    //         try {

    //             const allPendingItems = pendingItemsRef.current;
    //             const groupedItems = allPendingItems.reduce((acc, item) => {
    //                 if (!acc[item.idMeal]) {
    //                     acc[item.idMeal] = [];
    //                 }
    //                 acc[item.idMeal].push(item);
    //                 return acc;
    //             }, {});
    //             // Step 2: 处理每个分组
    //             const latestPendingItems = Object.entries(groupedItems).flatMap(([idMeal, items]) => {
    //                 if (items.length === 0) return [];

    //                 // 获取最旧的 oldCheckedState（第一个 item）
    //                 const oldestOldCheckedState = items[0].oldCheckedState;

    //                 // 获取最新的 newCheckedState（最后一个 item）
    //                 const latestItem = items[items.length - 1];
    //                 const latestNewCheckedState = latestItem.newCheckedState;

    //                 // 如果 new === old，说明来回切换后恢复原状，清除该 idMeal 的所有记录
    //                 if (latestNewCheckedState === oldestOldCheckedState) {
    //                     return [];
    //                 }
    //                 // 否则，保留最新的记录
    //                 else {
    //                     return [latestItem];
    //                 }
    //             });
    //             console.log("Sending to server: allPendingItems", allPendingItems, "groupedItems", groupedItems, "latestPendingItems", latestPendingItems);
    //             if (latestPendingItems.length === 0) {
    //                 console.log("no update");
    //                 return
    //             } else {

    //                 const result = await (await axiosInstanceWithTokenCheck()).post(
    //                     "http://localhost:5000/api/updateCheckState",
    //                     { updatedItems: latestPendingItems }
    //                 );
    //                 if (result.status === 200) {
    //                     setCartData(prevCartData => ({
    //                         ...prevCartData,
    //                         checkedAmount: result.data.result.checkedAmount,
    //                         checkedItem: result.data.result.checkedItem,
    //                     }));
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Failed to update check state in Redis", error);
    //         } finally {
    //             setPendingItems([]);
    //             console.log("pendingItems clear");

    //         }
    //     }, 500)
    //     , [])
    useEffect(() => {
        console.log(cartData, cartData.data.map(item => item.checked), "cartdata");

    }, [cartData])


    // // 修改原有的handleCheckMultiple函数，采用乐观更新策略
    // const handleCheckMultiple = (itemsToUpdate) => {
    //     // 1. 首先立即更新本地状态（乐观更新）
    //     setCartData(prevCartData => {
    //         if (!prevCartData) return prevCartData;

    //         // 创建数据的深拷贝以避免直接修改状态
    //         const newCartData = JSON.parse(JSON.stringify(prevCartData));

    //         // 更新checked状态
    //         for (const itemToUpdate of itemsToUpdate) {
    //             const cartItem = newCartData.data.find(item => item.idMeal === itemToUpdate.idMeal);
    //             if (cartItem) {
    //                 cartItem.checked = itemToUpdate.checked;
    //             }
    //         }

    //         // 重新计算checked统计数据
    //         const checkedItems = newCartData.data.filter(item => item.checked === true);
    //         newCartData.checkedItem = checkedItems.reduce((sum, item) => sum + item.numMeal, 0);
    //         newCartData.checkedAmount = Number(checkedItems.reduce(
    //             (sum, item) => sum + item.cartAmount, 0
    //         ).toFixed(2));

    //         return newCartData;
    //     });

    //     // 2. 异步发送到服务器/Redis
    //     handleCheckState(itemsToUpdate);
    // };



    // 也可以添加全选/取消全选函数
    const handleCheckAll = (isChecked) => {
        // 获取所有商品ID
        // setCartData(prevCartData => {
        //     if (!prevCartData || !prevCartData.data || prevCartData.data.length === 0) {
        //         return prevCartData;
        //     }

        //     // 创建数据的深拷贝
        //     const newCartData = JSON.parse(JSON.stringify(prevCartData));

        //     // 更新所有项目的checked状态
        //     newCartData.data.forEach(item => {
        //         item.checked = isChecked;
        //     });

        //     // 重新计算checked统计数据
        //     if (isChecked) {
        //         newCartData.checkedItem = newCartData.totalItem;
        //         newCartData.checkedAmount = newCartData.totalAmount;
        //     } else {
        //         newCartData.checkedItem = 0;
        //         newCartData.checkedAmount = 0;
        //     }

        //     return newCartData;
        // })


        // 准备要发送的数据
        const allItems = cartData.data.map(item => ({
            idMeal: item.idMeal,
            checked: item.checked,
            numMeal: item.numMeal,
        }));
        console.log("click!", allItems);

        // 发送到服务器/Redis
        // handleCheckState(allItems, isChecked);
        handleCartState({ items: allItems, isChecked: isChecked })
    };

    // const handleCheckAll = () => {
    //     const uncheckedItems = cartData.data.filter((item) => !item.checked);
    //     handleCheckState(
    //         uncheckedItems.length > 0 ? uncheckedItems : cartData.data,
    //         uncheckedItems.length > 0
    //     );
    // }

    const allchecked = useMemo(() =>
        cartData ? !cartData.data.some(item => !item.checked) : false
        , [cartData]);

    const handleCartState = async ({ items, isChecked, value }) => {
        try {

            const itemsArray = Array.isArray(items) ? items : [items];
            const itemsToUpdate = itemsArray.map(item => ({
                idMeal: item.idMeal,
                oldCheckedState: item.checked,
                newCheckedState: isChecked,
                oldValue: Number(item.numMeal),
                newValue: value === null || value === undefined ? item.numMeal : value,
            }));

            console.log(itemsArray, itemsToUpdate, "itemsToUpdate", value, "value1", cartData);

            setCartData(prevCartData => {
                if (!prevCartData) return prevCartData;

                return {
                    ...prevCartData,
                    data: prevCartData.data.map(dataItem => {
                        const shouldUpdate = itemsToUpdate.find(item => item.idMeal === dataItem.idMeal);
                        return shouldUpdate
                            ? {
                                ...dataItem,
                                checked: shouldUpdate.newCheckedState,
                                numMeal: shouldUpdate.newValue
                            }
                            : dataItem;
                    }),
                };
            });
            addPendingItems(itemsToUpdate)
            // if (isEmail) {
            //     addPendingItems(itemsToUpdate)
            // } else {
            //     // 未登录用户：仍然使用IndexedDB
            //     const db = await initDB();
            //     let existingCart = await db.get('cart', 'cartData');

            //     if (existingCart) {
            //         // 更新check状态
            //         for (const itemToUpdate of items) {
            //             const cartItem = existingCart.data.find(item => item.idMeal === itemToUpdate.idMeal);
            //             if (cartItem) {
            //                 cartItem.checked = itemToUpdate.checked;
            //             }
            //         }

            //         // 重新计算checked项目的统计数据
            //         const checkedItems = existingCart.data.filter(item => item.checked === true);
            //         existingCart.checkedItem = checkedItems.reduce((sum, item) => sum + item.numMeal, 0);
            //         existingCart.checkedAmount = Number(checkedItems.reduce(
            //             (sum, item) => sum + item.cartAmount, 0
            //         ).toFixed(2));

            //         // 更新本地状态
            //         setCartData(existingCart);

            //         // 更新IndexedDB
            //         await updateDB(Object.assign(existingCart, { idMeal: 'cartData' }));
            //     }
            // }
        } catch (error) {
            console.error("Error updating check state:", error);
        }
    };

    // const handleCheckout = async () => { // <--- 添加 async
    //     if (!cartData?.data?.some(item => item.checked)) {
    //         // toast({
    //         //     title: "Please select at least one item for checkout.",
    //         //     status: "error",
    //         //     duration: 2000,
    //         // });

    //         toast.error(
    //             <VStack alignItems="start">
    //                 <div>
    //                     <strong>Error</strong>
    //                 </div>
    //                 <div>
    //                     Please select at least one item for checkout.
    //                 </div>
    //             </VStack>
    //             ,
    //             {
    //                 ariaLabel: 'Email received',
    //                 position: "bottom-center",
    //                 autoClose: 2000,
    //                 hideProgressBar: false,
    //                 closeOnClick: false,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 theme: "light",
    //             });
    //         return;
    //     }
    //     try {
    // await finishPending(); // <--- 等待所有待處理項目被處理並發送完成
    // // 只有當 finishPending 完成後才導航

    // navigate('/checkout#deliver');

    //     } catch (error) {
    //         console.error("結帳前處理待處理項目失敗:", error);
    //         // toast({
    //         //     title: "結帳失敗",
    //         //     description: "請稍後再試或聯繫客服。",
    //         //     status: "error",
    //         //     duration: 3000,
    //         // });
    //         toast.error(
    //             <VStack alignItems="start">
    //                 <div>
    //                     <strong>Checkout failed.</strong>
    //                 </div>
    //                 <div>
    //                     Please try again later or contact customer service.
    //                 </div>
    //             </VStack>
    //             , {
    //                 position: "bottom-center",
    //                 autoClose: 2000,
    //                 hideProgressBar: false,
    //                 closeOnClick: false,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 theme: "light",
    //             });

    //     }
    // }

    const handleCheckout = async () => { // <--- 添加 async
        if (!cartData?.data?.some(item => item.checked)) {
            // toast({
            //     title: "Please select at least one item for checkout.",
            //     status: "error",
            //     duration: 2000,
            // });

            toast.error(
                <VStack alignItems="start">
                    <div>
                        <strong>Error</strong>
                    </div>
                    <div>
                        Please select at least one item for checkout.
                    </div>
                </VStack>
                ,
                {
                    ariaLabel: 'Email received',
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            return;
        }
        try {
            authCheckout()

        } catch (error) {
            console.error("結帳前處理待處理項目失敗:", error);
            // toast({
            //     title: "結帳失敗",
            //     description: "請稍後再試或聯繫客服。",
            //     status: "error",
            //     duration: 3000,
            // });
            toast.error(
                <VStack alignItems="start">
                    <div>
                        <strong>Checkout failed.</strong>
                    </div>
                    <div>
                        Please try again later or contact customer service.
                    </div>
                </VStack>
                , {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

        }
    }
    const authCheckout = async () => {
        try {
            await finishPending(); // <--- 等待所有待處理項目被處理並發送完成
            // 只有當 finishPending 完成後才導航

            navigate('/checkout?useDraft=false#deliver');
        } catch (error) {
            console.log("error", error);

        }
    }
    const mergeCart = async ({ token }) => {
        try {
            console.log("mergeCart");

            // 只有當 finishPending 完成後才導航
            // setTimeout(() => {
            //     navigate('/checkout#deliver');
            // }, 2000);
            // setUserInfo(prev => { return { ...prev, unAuthCheckout: false } })
            const endpoint = "http://localhost:5000/api/mergeCart"

            const payload = { userInfo: userInfo, token: token }
            const result = await (await axiosInstanceWithTokenCheck()).post(endpoint, payload)
            if (result.status === 200) {
                // setCartData(prevCartData => ({
                //     ...prevCartData,
                //     totalAmount: result.data.result.totalAmount,
                //         totalItem: result.data.result.totalItem,
                //     checkedAmount: result.data.result.checkedAmount,
                //     checkedItem: result.data.result.checkedItem,
                // }));
                setCartData(prevCartData => {
                    if (!prevCartData) return prevCartData;
                    return {
                        ...prevCartData,
                        data: prevCartData.data.map(dataItem => {
                            // 找到对应的更新项
                            const updatedItem = result.data.result.data.find(item => item.idMeal === dataItem.idMeal);
                            return updatedItem ? {
                                ...dataItem,
                                numMeal: updatedItem.numMeal,
                                cartAmount: updatedItem.cartAmount, // 更新 cartAmount
                                checked: updatedItem.checked || false
                            } : dataItem;
                        }),
                        totalAmount: result.data.result.totalAmount,
                        totalItem: result.data.result.totalItem,
                        checkedAmount: result.data.result.checkedAmount,
                        checkedItem: result.data.result.checkedItem
                    };
                });
            }

            setTimeout(() => {

                console.log("access token update complete");
                updateToken()
                navigate('/checkout?useDraft=true#deliver');

            }, 2000);

        } catch (error) {
            if (error.code === "ECONNABORTED") {
                // toast({ title: "請求超時：後端處理時間過長", status: "error" });
            } else if (error.response) {
                // 正常後端錯誤（如 400、500）
            } else {
                // toast({ title: "網路錯誤", status: "error" });
            }

        }
    }
    // const unAuthCheckout = async (latestPendingItems) => {
    //     try {
    //         const result = await (await axiosInstanceWithTokenCheck()).post(
    //             "http://localhost:5000/api/unAuthCheckout",
    //             { updatedItems: latestPendingItems }
    //         );
    //         if (result.status === 200) {
    //             // setCartData(prevCartData => ({
    //             //     ...prevCartData,
    //             //     totalAmount: result.data.result.totalAmount,
    //             //         totalItem: result.data.result.totalItem,
    //             //     checkedAmount: result.data.result.checkedAmount,
    //             //     checkedItem: result.data.result.checkedItem,
    //             // }));
    //             setCartData(prevCartData => {
    //                 if (!prevCartData) return prevCartData;
    //                 return {
    //                     ...prevCartData,
    //                     data: prevCartData.data.map(dataItem => {
    //                         // 找到对应的更新项
    //                         const updatedItem = result.data.result.data.find(item => item.idMeal === dataItem.idMeal);
    //                         return updatedItem ? {
    //                             ...dataItem,
    //                             numMeal: updatedItem.numMeal,
    //                             cartAmount: updatedItem.cartAmount, // 更新 cartAmount
    //                             checked: updatedItem.checked || false
    //                         } : dataItem;
    //                     }),
    //                     totalAmount: result.data.result.totalAmount,
    //                     totalItem: result.data.result.totalItem,
    //                     checkedAmount: result.data.result.checkedAmount,
    //                     checkedItem: result.data.result.checkedItem
    //                 };
    //             });
    //         }
    //         navigate('/checkout#deliver')
    //     } catch (error) {
    //         if (error.code === "ECONNABORTED") {
    //             // toast({ title: "請求超時：後端處理時間過長", status: "error" });
    //         } else if (error.response) {
    //             // 正常後端錯誤（如 400、500）
    //         } else {
    //             // toast({ title: "網路錯誤", status: "error" });
    //         }
    //     }
    // }


    //use apollo to load data
    if (loading) {
        return <Box>Loading...</Box>;
    } else if (error) {
        return <Box>Error Occurred</Box>;
    }

    if (!cartData || cartData.totalItem === 0) {
        return <Box width="100%"><Box textStyle="StyledH2" color="#000000" margin="0 auto" width="fit-content">Your Cart is Empty</Box></Box>
    }

    return (
        <VStack width="100%">
            <CartPageHeading numItem={cartData.totalItem} />
            <Stack direction={{ xl: "row", base: "column" }} width="100%" alignItems="flex-start" spacing={6}>
                <Box width={{ xl: "75%", base: "100%" }}>
                    <Table display={{ md: "table", base: "block" }} width="100%">
                        <Thead display={{ md: "table-header-group", base: "none" }}>
                            <Tr>
                                <Th><Checkbox
                                    isChecked={allchecked}
                                    onChange={(e) =>
                                        handleCheckAll(!allchecked)
                                    }
                                ></Checkbox></Th>
                                <Th colSpan={3}>Item</Th>
                                <Th>Price</Th>
                                <Th>Quantity</Th>
                                <Th>Total</Th>
                            </Tr>
                        </Thead>
                        <Tbody display={{ md: "table-row-group", base: "block" }}>
                            {cartData.data.map((item, index) => (
                                // <Checkbox>
                                <Tr key={index}
                                    borderBottomWidth="1px"
                                    display={{ md: "table-row", base: "grid" }}
                                    gridTemplateAreas={{
                                        md: "none",
                                        sm: `
                                "check img meal meal meal"
                                "check img price quantity total"
                                `,
                                        base: `
                                    "check img meal"
                                    "check price price"
                                    "check quantity quantity"
                                    "check total total"
                                `
                                    }}
                                >
                                    <Td
                                        colSpan={1}
                                        gridArea={"check"}
                                        display={{ md: "table-cell", base: "block" }}
                                        paddingLeft="0"
                                        paddingRight="0"
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                        width="1.5rem"
                                    >
                                        <Box>
                                            <Checkbox
                                                key={index}
                                                isChecked={item.checked}
                                                onChange={(e) => handleCartState({ items: item, isChecked: e.target.checked, value: item.numMeal })}
                                            ></Checkbox>
                                        </Box>
                                    </Td>
                                    <Td
                                        colSpan={1}
                                        gridArea={"img"}
                                        display={{ md: "table-cell", base: "block" }}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                        width={`${cartPageConfig.orderImgWidth}px`}
                                        padding={{ md: "1.5rem", base: "0" }}
                                    >
                                        <Box width={`${cartPageConfig.orderImgWidth}px`}>
                                            <LazyLoadImage
                                                src={item.strMealThumb}
                                                alt={item.strMeal}
                                                width="auto"
                                                imgWidth={cartPageConfig.orderImgWidth}
                                                auto="webp"
                                                height={`${cartPageConfig.orderImgWidth}px`}
                                                objectFit="cover"
                                            />
                                        </Box>
                                    </Td>
                                    <Td colSpan={2} gridArea={"meal"} display={{ md: "table-cell", base: "flex" }} flexDirection="row" borderBottomWidth={{ md: "1px", base: "0" }} alignItems="center" paddingLeft="0" paddingRight="0">
                                        <Box textStyle="StyledText" color="#333333">
                                            {item.strMeal}
                                        </Box>
                                        <Button
                                            backgroundColor="#e5e5e5"
                                            borderRadius="50%"
                                            size="xs"
                                            //set meal number to 0
                                            //use async/await to prevent Race Condition
                                            onClick={async () => {
                                                await handleCartState({ items: item, isChecked: item.checked, value: 0 })
                                                handleInputChange(item, 0)
                                                // await setIsUpdate(isUpdate + 1)
                                            }}
                                            display={{ md: "none", base: "block" }}
                                            marginLeft="1rem"
                                        ><SmallCloseIcon color="#757575" /></Button>
                                    </Td>
                                    <Td
                                        gridArea={"price"}
                                        display={{ md: "table-cell", base: "flex" }}
                                        flexDirection={{ md: "none", sm: "column", base: "row" }}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                    >
                                        <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Price</Text>
                                        <Box>${item.baseAmount}</Box>
                                    </Td>
                                    <Td
                                        gridArea={"quantity"}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                        display={{ md: "table-cell", base: "flex" }}
                                        flexDirection={{ md: "none", sm: "column", base: "row" }}
                                    >
                                        <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Quantity</Text>
                                        <HStack>
                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                fontSize="1.5rem"
                                                size="md"
                                                //use async/await to prevent Race Condition
                                                onClick={() => {
                                                    handleCartState({ items: item, isChecked: item.checked, value: item.numMeal - 1 })
                                                    handleInputChange(item, item.numMeal - 1)
                                                }}>-</Button>
                                            <Input
                                                maxWidth="8vh"
                                                width="8vh"
                                                textAlign="center"
                                                value={inputValues[item.strMeal]}
                                                //can change the input number through typing, but the fetch will only be triggered on blur
                                                onChange={(e) => { handleInputChange(item, e.target.value) }}
                                                onBlur={(e) => handleCartState({ items: item, isChecked: item.checked, value: Number(e.target.value) })
                                                }
                                            />

                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                fontSize="1.5rem"
                                                size="md"
                                                //use async/await to prevent Race Condition
                                                onClick={() => {
                                                    handleCartState({ items: item, isChecked: item.checked, value: item.numMeal + 1 })
                                                    handleInputChange(item, item.numMeal + 1)
                                                }}
                                            >+</Button>
                                        </HStack>
                                    </Td>
                                    <Td
                                        gridArea={"total"}
                                        display={{ md: "table-cell", base: "flex" }}
                                        flexDirection={{ md: "none", sm: "column", base: "row" }}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                    >
                                        <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Total</Text>
                                        <HStack justifyContent={{ md: "right", base: "none" }}>
                                            {/* <Box gridArea={"total"}>${Number((item.baseAmount * item.numMeal).toFixed(2))}</Box> */}
                                            <Box gridArea={"total"}>${item.cartAmount}</Box>
                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                size="xs"
                                                //set meal number to 0
                                                //use async/await to prevent Race Condition
                                                onClick={async () => {
                                                    await handleCartState({ items: item, isChecked: item.checked, value: 0 })
                                                    handleInputChange(item, 0)
                                                    // await setIsUpdate(isUpdate + 1)
                                                }}
                                                gridArea={"delete"}
                                                display={{ md: "block", base: "none" }}
                                            ><SmallCloseIcon color="#757575" /></Button>
                                        </HStack>
                                    </Td>
                                </Tr>
                                // </Checkbox>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Box width={{ xl: "25%", md: "50%", base: "100%" }}>
                    <Table>
                        <Thead>
                            <Th>Order Summary</Th>
                            <Th>{cartData.checkedItem} {cartData.checkedItem > 1 ? `Items` : `Item`}</Th>
                        </Thead>
                    </Table>
                    <HStack justifyContent="space-between">
                        <Box>Subtotal</Box>
                        <Box>${cartData.checkedAmount}</Box>
                    </HStack>
                    <HStack justifyContent="space-between">
                        <Box>Grand total</Box>
                        <Box>${cartData.checkedAmount}</Box>
                    </HStack>
                    {isEmail ?
                        <Button
                            color="#ffffff"
                            backgroundColor="#da1a32"
                            border="1px solid #da1a32"
                            width="100%"
                            marginTop="1vh"
                            _hover={{
                                color: "#da1a32",
                                backgroundColor: "#ffffff"
                            }}
                            onClick={handleCheckout}
                            disabled={!cartData?.data?.some(item => item.checked)}
                        >
                            CHECKOUT
                        </Button>
                        : <Modal id="update">
                            <ModalButton>
                                <Button
                                    color="#ffffff"
                                    backgroundColor="#da1a32"
                                    border="1px solid #da1a32"
                                    width="100%"
                                    marginTop="1vh"
                                    _hover={{
                                        color: "#da1a32",
                                        backgroundColor: "#ffffff"
                                    }}
                                    disabled={!cartData?.data?.some(item => item.checked)}
                                >
                                    CHECKOUT
                                </Button>
                            </ModalButton>
                            <ModalContent>
                                <LoginRotate onLoginSuccess={async (token) => {

                                    console.log("login success!!!! onLoginSuccess", token);
                                    await setUserInfo(prev => { return { ...prev, mergeCart: true, accessToken: token } })
                                    console.log("mergecart start");

                                    await mergeCart({ token: token })
                                    console.log("mergecart end");

                                }} />
                            </ModalContent>
                        </Modal>
                    }

                </Box>
            </Stack>
        </VStack>
    );
};

export default CartPage;
