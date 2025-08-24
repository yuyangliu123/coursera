import { gql, useQuery } from '@apollo/client';
import { Box, Button, Checkbox, HStack, Image, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast, VStack } from '@chakra-ui/react';
import { useUserRotate } from '../../provider/JwtTokenRotate';
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
    const { email, availableAccessToken, isEmail, accessToken } = useUserRotate();
    const { cartItem, setCartItem } = useContext(MealContext);

    const [cartData, setCartData] = useState(initialData);
    const [inputValues, setInputValues] = useState(initialInputValue);
    const navigate = useNavigate();
    const toast = useToast()
    // const [updatedItems, setUpdatedItems] = useState({});
    //If a boolean is used, useEffect will not be triggered when isUpdate is false
    // const [isUpdate, setIsUpdate] = useState(0)

    console.log(initialInputValue, "initialInputValue", inputValues, initialInputValue == inputValues);

    //modify current input
    const handleInputChange = (meal, value) => {
        setInputValues(prev => ({ ...prev, [meal.strMeal]: value }));
    };

    // 创建发送请求到后端的函数
    const sendUpdateToServer = async (meal, value) => {
        // 准备要发送的数据
        const updatedMeal = {
            idMeal: meal.idMeal,
            numMeal: Number(value),
            baseAmount: meal.baseAmount
        };

        try {
            if (isEmail) {
                // 已登录用户：发送请求到后端
                let result = await (await axiosInstanceWithTokenCheck()).post(
                    "http://localhost:5000/api/update",
                    { event: "update", updatedItems: updatedMeal }
                );

                // 处理服务器响应
                if (result) {
                    if (result.data.status === "update") {
                        // 同步服务器返回的结果
                        setCartData(result.data.result);
                        setCartItem(result.data.result.totalItem);
                    } else if (result.data.status === "delete") {
                        setCartItem(0);
                        setCartData("");
                    }
                }
            } else {
                // 未登录用户：更新本地数据库
                const db = await initDB();
                let existingCart = await db.get('cart', 'cartData');

                if (existingCart) {
                    if (Number(value) <= 0) {
                        // 如果数量为0，从购物车中移除该商品
                        existingCart.data = existingCart.data.filter(item => item.idMeal !== meal.idMeal);
                    } else {
                        // 否则更新该商品的数量
                        const targetItem = existingCart.data.find(item => item.idMeal === meal.idMeal);
                        if (targetItem) {
                            targetItem.numMeal = Number(value);
                            targetItem.cartAmount = targetItem.numMeal * targetItem.baseAmount;
                        }
                    }

                    // 重新计算总金额和总商品数量
                    existingCart.totalAmount = existingCart.data.reduce(
                        (sum, item) => sum + item.cartAmount,
                        0
                    );
                    existingCart.totalAmount = Number(existingCart.totalAmount.toFixed(2));
                    existingCart.totalItem = existingCart.data.reduce(
                        (sum, item) => sum + item.numMeal,
                        0
                    );

                    // 更新本地状态
                    setCartData(existingCart);
                    setCartItem(existingCart.totalItem);

                    // 更新IndexedDB
                    await updateDB(Object.assign(existingCart, { idMeal: 'cartData' }));
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    // 使用 debounceRAF 创建防抖版本的服务器更新函数
    // 使用 useCallback 确保函数引用稳定，避免重复创建
    const debouncedSendCartItemToServer = useCallback(
        debounceRAF(async (updatedItem) => {
            try {
                const result = await (await axiosInstanceWithTokenCheck()).post(
                    "http://localhost:5000/api/updateCartItem",
                    { updatedItems: updatedItem }
                );
                if (result.status === 200) {
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
                    // setCartData(prevCartData => ({
                    //     ...prevCartData,
                    //     checkedAmount: result.data.result.checkedAmount,
                    //     checkedItem: result.data.result.checkedItem,
                    //     // cartAmount:result.data.result.cartAmount,  here
                    // }));
                    console.log(result, "result", cartData, "cartdata");
                }
            } catch (error) {
                console.error("Failed to update check state in Redis", error);
            }
        }, 500)
        , [])


    const handleChangeValue = async (items, value) => {
        try {
            const itemsArray = Array.isArray(items) ? items : [items];
            const itemsToUpdate = itemsArray.map(item => ({
                idMeal: item.idMeal,
                value: Number(value)
            }))
            console.log(itemsToUpdate, "itemsToUpdate", cartData, "cartData");
            setCartData(prevCartData => {
                if (!prevCartData) return prevCartData;
                return {
                    ...prevCartData,
                    data: prevCartData.data.map(dataItem => {
                        const shouldUpdate = itemsToUpdate.some(item => item.idMeal === dataItem.idMeal);
                        return shouldUpdate ? { ...dataItem, numMeal: value } : dataItem;
                    }),
                };
            });
            if (isEmail) {
                debouncedSendCartItemToServer(itemsToUpdate);
            } else {
                console.log("not user");

            }
        } catch (e) {

        }
    }
    // 修改 handleChangeValue 函数为 Optimistic Update 模式
    // const handleChangeValue = (meal, value) => {
    //     // 1. 首先立即更新本地状态（乐观更新）
    //     setCartData(prevCartData => {
    //         if (!prevCartData) return prevCartData;

    //         let updatedData;
    //         const numValue = Number(value);

    //         // 直接处理删除和更新的逻辑
    //         if (numValue <= 0) {
    //             // 如果数量为0或负数，直接从列表中过滤掉该商品
    //             updatedData = prevCartData.data.filter(item => item.idMeal !== meal.idMeal);
    //         } else {
    //             // 只更新数量
    //             updatedData = prevCartData.data.map(item =>
    //                 item.idMeal === meal.idMeal
    //                     ? { ...item, numMeal: numValue }
    //                     : item
    //             );
    //         }

    //         // 重新计算总金额和总商品数量
    //         const newTotalAmount = updatedData.reduce(
    //             (sum, item) => sum + (item.baseAmount * item.numMeal),
    //             0
    //         );
    //         const newTotalItem = updatedData.reduce(
    //             (sum, item) => sum + item.numMeal,
    //             0
    //         );

    //         // 返回更新后的购物车数据
    //         return {
    //             ...prevCartData,
    //             data: updatedData,
    //             totalAmount: Number(newTotalAmount.toFixed(2)),
    //             totalItem: newTotalItem
    //         };
    //     });

    //     // 更新导航栏中的购物车数量
    //     setCartItem(prev => {
    //         // 计算差值：新值 - 旧值
    //         const diff = Number(value) - meal.numMeal;
    //         return Math.max(0, prev + diff);
    //     });
    //     debouncedSendUpdate(meal, value);
    // };


    // 1. 用 useRef 保存防抖函數，避免 re-render 時重置
    // const debouncedApiCallRef = useRef(
    //     debounceRAF(async (itemsToUpdate) => {
    //         try {
    //             const response = await (await axiosInstanceWithTokenCheck()).post(
    //                 "http://localhost:5000/api/updateCheckState",
    //                 {
    //                     updatedItems: itemsToUpdate,
    //                 }
    //             );

    //             if (response?.data?.status === "checked" || response?.data?.status === "uncheck") {
    //                 setCartData(response.data.result); // 同步後端返回的最新狀態
    //             }
    //         } catch (error) {
    //             console.error("API Error:", error);
    //             // 可選：回滾前端狀態（需額外邏輯）
    //         }
    //     }, 500) // 防抖時間 500ms
    // );


    // // 2. 主函數：前端立即更新，後端防抖
    // const handleCheckbox = (items, isChecked) => {
    //     // 確保 items 是陣列
    //     const itemsArray = Array.isArray(items) ? items : [items];

    //     // 樂觀更新前端狀態（立即生效）
    // setCartData(prevCartData => {
    //     if (!prevCartData) return prevCartData;
    //     return {
    //         ...prevCartData,
    //         data: prevCartData.data.map(dataItem => {
    //             const shouldUpdate = itemsArray.some(item => item.idMeal === dataItem.idMeal);
    //             return shouldUpdate ? { ...dataItem, checked: isChecked } : dataItem;
    //         }),
    //     };
    // });

    //     // 防抖發送後端請求（只會執行最後一次）
    //     debouncedApiCallRef.current(
    //         itemsArray.map(item => ({ ...item, checked: isChecked }))
    //     );
    // };
    const handleCheckState = async (items, isChecked) => {
        try {
            console.log(items, "items");

            const itemsArray = Array.isArray(items) ? items : [items];
            const itemsToUpdate = itemsArray.map(item => ({
                idMeal: item.idMeal,
                oldCheckedState: item.checked,
                newCheckedState: isChecked,
            }));
            setCartData(prevCartData => {
                if (!prevCartData) return prevCartData;
                return {
                    ...prevCartData,
                    data: prevCartData.data.map(dataItem => {
                        const shouldUpdate = itemsToUpdate.some(item => item.idMeal === dataItem.idMeal);
                        return shouldUpdate ? { ...dataItem, checked: isChecked } : dataItem;
                    }),
                };
            });

            if (isEmail) {
                debouncedSendCheckStateToServer(itemsToUpdate);
            } else {
                // 未登录用户：仍然使用IndexedDB
                const db = await initDB();
                let existingCart = await db.get('cart', 'cartData');

                if (existingCart) {
                    // 更新check状态
                    for (const itemToUpdate of items) {
                        const cartItem = existingCart.data.find(item => item.idMeal === itemToUpdate.idMeal);
                        if (cartItem) {
                            cartItem.checked = itemToUpdate.checked;
                        }
                    }

                    // 重新计算checked项目的统计数据
                    const checkedItems = existingCart.data.filter(item => item.checked === true);
                    existingCart.checkedItem = checkedItems.reduce((sum, item) => sum + item.numMeal, 0);
                    existingCart.checkedAmount = Number(checkedItems.reduce(
                        (sum, item) => sum + item.cartAmount, 0
                    ).toFixed(2));

                    // 更新本地状态
                    setCartData(existingCart);

                    // 更新IndexedDB
                    await updateDB(Object.assign(existingCart, { idMeal: 'cartData' }));
                }
            }
        } catch (error) {
            console.error("Error updating check state:", error);
        }
    };
    const debouncedSendCheckStateToServer = useCallback(
        debounceRAF(async (itemsArray) => {
            try {
                const result = await (await axiosInstanceWithTokenCheck()).post(
                    "http://localhost:5000/api/updateCheckState",
                    { updatedItems: itemsArray }
                );
                if (result.status === 200) {
                    setCartData(prevCartData => ({
                        ...prevCartData,
                        checkedAmount: result.data.result.checkedAmount,
                        checkedItem: result.data.result.checkedItem,
                    }));
                }
            } catch (error) {
                console.error("Failed to update check state in Redis", error);
            }
        }, 1000)
        , [])

    const handleCheckAll = (isChecked) => {


        // 准备要发送的数据
        const allItems = cartData.data.map(item => ({
            idMeal: item.idMeal,
            checked: item.checked
        }));
        // 发送到服务器/Redis
        handleCheckState(allItems, isChecked);
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



    // useEffect(() => {
    //     const loadCartData = async () => {
    //         if (isEmail === true) {
    //             if (!loading && !error && cart?.cartpageformat?.length > 0) {
    //                 const cartInfo = cart.cartpageformat[0];
    //                 const updatedCartData = {
    //                     ...cartInfo,
    //                     data: cartInfo.data.map(item => ({
    //                         ...item,
    //                         checked: false
    //                     }))
    //                 };

    //                 setCartData(updatedCartData);

    //                 const checkedItems = cartInfo.data.filter(item => item.checked === true);
    //                 if (checkedItems.length > 0) {
    //                     handleCheckbox(checkedItems, false);
    //                 }
    //             } else {
    //                 setCartData("");
    //             }
    //         } else if (isEmail === false) {
    //             const db = await initDB();
    //             const existingCart = await db.get('cart', 'cartData');
    //             if (existingCart) {
    //                 setCartData(existingCart);
    //             }
    //         }
    //     };

    //     loadCartData();
    // }, [loading, error, cart, isEmail]);



    //Since both logged-in and non-logged-in states use the same data format,
    //the method of handling input values is the same.
    //set input value after loading cartData
    // useEffect(() => {
    //     if (cartData) {
    //         const initialInputValues = {};
    //         cartData.data.forEach(item => {
    //             initialInputValues[item.strMeal] = item.numMeal;
    //         });
    //         setInputValues(initialInputValues);
    //     }
    // }, [cartData]);


    const handleCheckout = () => {
        if (!cartData?.data?.some(item => item.checked)) {
            toast({
                title: "Please select at least one item for checkout.",
                status: "error",
                duration: 2000,
            });
            return;
        }

        // 使用 navigate 而不是 window.location.href
        navigate('/checkout#deliver');
    }





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
                                                onChange={(e) => handleCheckState(item, e.target.checked)}
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
                                            onClick={() => handleChangeValue(item, 0)}
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
                                                    handleChangeValue(item, item.numMeal - 1)
                                                    handleInputChange(item, item.numMeal - 1)
                                                }}>-</Button>
                                            <Input
                                                maxWidth="8vh"
                                                width="8vh"
                                                textAlign="center"
                                                value={inputValues[item.strMeal]}
                                                //can change the input number through typing, but the fetch will only be triggered on blur
                                                onChange={(e) => { handleInputChange(item, e.target.value) }}
                                                onBlur={(e) => handleChangeValue(item, Number(e.target.value))}
                                            />

                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                fontSize="1.5rem"
                                                size="md"
                                                //use async/await to prevent Race Condition
                                                onClick={() => {
                                                    handleChangeValue(item, item.numMeal + 1)
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
                                                    await handleChangeValue(item, 0)
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
                </Box>
            </Stack>
        </VStack>
    );
};

export default CartPage;
